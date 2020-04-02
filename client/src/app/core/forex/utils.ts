import {FOUR_DIGIT_POINT, TWO_DIGIT_POINT} from "./constants";
import {Account, AccountSize} from "../../domain";
import {InstrumentSeparator, SupportedInstruments} from "../../../../../common/forex";

export const getPoint = (bid: number, ask: number) => {

  const bidAsString = bid.toString();
  const askAsString = ask.toString();

  const longestString = bidAsString.length > askAsString.length ? bidAsString : askAsString;

  const decimals = longestString.split('.').pop();

  let point;
  if (decimals.length >= 4) {
    point = FOUR_DIGIT_POINT;
  } else if (decimals.length > 2 && decimals.length < 4) {
    point = TWO_DIGIT_POINT;
  }

  return point;
};

const instrumentIncludesCurrency = (instrument, currency) => {
  const [currencyOne, currencyTwo] = instrument.split(InstrumentSeparator);
  return ({instrument}) => {
    return instrument.includes(currency) &&
      (instrument.includes(currencyOne) || instrument.includes(currencyTwo))
  }
};

export const calculatePipValue = (account: Account, instrument, point, price, rates) => {

  const [currencyOne, currencyTwo] = instrument.split(InstrumentSeparator);

  const pricePerPip = (point * account.accountSize) / price;

  if (currencyTwo === account.baseCurrency) {

    return pricePerPip;

  } else if (currencyOne === account.baseCurrency) {

    return pricePerPip / price

  } else {

    const rate = rates.prices.find(instrumentIncludesCurrency(instrument, account.baseCurrency));
    const pricePerPip = account.accountSize / AccountSize.Standard * 10;

    return pricePerPip / parseFloat(rate.closeoutAsk);
  }

};

export const calculatePositionSize = (
  account: Account,
  instrument,
  point,
  price,
  rates) => {

  const {balance, risk, stoploss} = account;
  const pipValue = calculatePipValue(account, instrument, point, price, rates);
  const result = (balance * (risk / 100)) / (stoploss * pipValue);

  if (point === TWO_DIGIT_POINT && instrument.includes(account.baseCurrency)) {
    return result / 100;
  }

  return result;
};

export const getFormattedPosition = (
  account: Account,
  instrument,
  point,
  price,
  rates) => {

  const position = calculatePositionSize(account, instrument, point, price, rates);

  if (position) {

    const [first, second] = position.toFixed(2).split(".");
    return `${first.padEnd(1, "0")}.${second.padEnd(2, "0")}`;
  }

  return "0.00";
};

export const getExchangeRateInstruments = (account: Account, prices) => {

  const project = price => {
    const [base, _] = price.instrument.split(InstrumentSeparator);
    return [`${base}_${account.baseCurrency}`, `${account.baseCurrency}_${base}`];
  };

  const instrumentsWithBaseCurrency = price => !price.instrument.includes(account.baseCurrency);

  return prices
    .filter(instrumentsWithBaseCurrency)
    .map(project)
    .reduce((prev, curr) => {

      const [instrument1, instrument2] = curr;

      const list = [
        SupportedInstruments.includes(instrument1) ?
          instrument1 :
          instrument2
      ];

      return prev.concat(list)

    }, []);
};

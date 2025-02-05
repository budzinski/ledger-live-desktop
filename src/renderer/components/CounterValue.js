// @flow
import { BigNumber } from "bignumber.js";
import React from "react";
import { useSelector } from "react-redux";
import type { Currency } from "@ledgerhq/live-common/lib/types";
import { useCalculate } from "@ledgerhq/live-common/lib/countervalues/react";
import { counterValueCurrencySelector } from "~/renderer/reducers/settings";
import FormattedVal from "~/renderer/components/FormattedVal";
import ToolTip from "./Tooltip";
import { Trans } from "react-i18next";
import useTheme from "~/renderer/hooks/useTheme";

type Props = {
  // wich market to query
  currency: Currency,

  // when? if not given: take latest
  date?: Date,

  value: BigNumber | number,

  alwaysShowSign?: boolean,

  subMagnitude?: number,

  placeholder?: React$Node,

  prefix?: React$Node,
  suffix?: React$Node,
  placeholderStyle?: { [key: string]: string | number },
};

export const NoCountervaluePlaceholder = ({
  placeholder,
  style = {},
}: {
  placeholder?: React$Node,
  style?: *,
}) => {
  const colors = useTheme("colors");

  return (
    <div style={{ ...style, maxHeight: "16px" }}>
      <ToolTip
        content={<Trans i18nKey="errors.countervaluesUnavailable.title" />}
        containerStyle={{ color: colors.palette.text.shade40 }}
      >
        {placeholder || "-"}
      </ToolTip>
    </div>
  );
};

export default function CounterValue({
  value: valueProp,
  date,
  currency,
  alwaysShowSign = false,
  placeholder,
  prefix,
  suffix,
  placeholderStyle,
  ...props
}: Props) {
  const value = valueProp instanceof BigNumber ? valueProp.toNumber() : valueProp;
  const counterValueCurrency = useSelector(counterValueCurrencySelector);
  const countervalue = useCalculate({
    from: currency,
    to: counterValueCurrency,
    value,
    disableRounding: true,
    date,
  });

  if (typeof countervalue !== "number") {
    return <NoCountervaluePlaceholder placeholder={placeholder} style={placeholderStyle} />;
  }

  return (
    <>
      {prefix || null}
      <FormattedVal
        {...props}
        val={countervalue}
        currency={currency}
        unit={counterValueCurrency.units[0]}
        showCode
        alwaysShowSign={alwaysShowSign}
      />
      {suffix || null}
    </>
  );
}

import { Dispatch, memo, SetStateAction } from 'react';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { Currency } from '@monerium/sdk';

import TokenIcon from 'src/components/Tokens/Icon';

import s from './TokenFilter.module.scss';

const TokenFilter = memo(
  ({
    selected,
    setSelected,
  }: {
    selected: Currency;
    setSelected: Dispatch<SetStateAction<Currency>>;
  }) => {
    return (
      <FormControl size="small">
        <Select
          value={selected}
          onChange={(e) => setSelected(e.target.value as Currency)}
          displayEmpty
          className={s.icon}
        >
          <MenuItem value={Currency.eur}>
            <div className={s.row}>
              <TokenIcon currency={Currency.eur} className={s.icon} /> EURe
            </div>
          </MenuItem>
          <MenuItem value={Currency.gbp}>
            <div className={s.row}>
              <TokenIcon currency={Currency.gbp} className={s.icon} /> GBPe
            </div>
          </MenuItem>
        </Select>
      </FormControl>
    );
  }
);
TokenFilter.displayName = 'TokenFilter';
export default TokenFilter;

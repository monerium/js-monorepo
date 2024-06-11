'use client';
import React from 'react';
import Image from 'next/image';
import Button from '@mui/material/Button';

import { useMonerium } from '@monerium/sdk-react-provider';

import s from './MoneriumConnect.module.scss';
export const MoneriumConnect = () => {
  const { authorize } = useMonerium();

  return (
    <div className={s.wrapper}>
      <Button
        href="https://monerium.com"
        size="large"
        variant="contained"
        onClick={authorize}
      >
        Read more
      </Button>
      <Button
        size="large"
        variant="outlined"
        onClick={authorize}
        startIcon={
          <Image
            src="/monerium-icon.png"
            alt="Monerium icon"
            width={16}
            height={20}
            priority
          />
        }
      >
        Connect
      </Button>
    </div>
  );
};

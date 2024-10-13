'use client'

import { SessionProvider } from 'next-auth/react';
import React, { type PropsWithChildren } from 'react'

const SessionClientProvider = (props: PropsWithChildren) => {
  return (
    <SessionProvider>
      {props.children}
    </SessionProvider>
  )
}

export default SessionClientProvider;
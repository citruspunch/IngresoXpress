import { Font } from '@react-pdf/renderer'
import { createTw } from 'react-pdf-tailwind'

Font.register({
  family: 'Manrope',
  fonts: [
    {
      src: '/fonts/Manrope-Regular.ttf',
      fontWeight: 'normal',
    },
    {
      src: '/fonts/Manrope-Bold.ttf',
      fontWeight: 'bold',
    },
    {
      src: '/fonts/Manrope-ExtraBold.ttf',
      fontWeight: 'ultrabold',
    },
    {
      src: '/fonts/Manrope-Light.ttf',
      fontWeight: 'light',
    },
    {
      src: '/fonts/Manrope-Medium.ttf',
      fontWeight: 'medium',
    },
    {
      src: '/fonts/Manrope-SemiBold.ttf',
      fontWeight: 'semibold',
    },
  ],
})

export const tw = createTw({
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope'],
      },
      fontWeight: {
        light: 'light',
        normal: 'normal',
        medium: 'medium',
        semibold: 'semibold',
        bold: 'bold',
        extrabold: 'extrabold',
      },
      fontSize: {
        xs: '10px',
        sm: '12px',
        base: '14px',
        lg: '18px',
        xl: '22px',
        '2xl': '28px',
      },
      colors: {
        gray: {
          100: '#f5f5f5',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          900: '#111827',
        },
      },
    },
  },
})

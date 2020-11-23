import { Checkbox, Theme, createStyles, makeStyles, styled } from '@material-ui/core'
import React from 'react'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableTable: {
      color: 'var(--text-primary)',
      borderSpacing: 0,
      border: '1px solid var(--border-primary)',
    },
    tableHeadRow: {
      outline: 0,
      verticalAlign: 'middle',
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-secondary)',
      fontWeight: 500,
      lineHeight: '1.5rem',
      position: 'relative',
      borderBottom: '1px solid var(--border-primary)',
      '&:hover $resizeHandle': {
        opacity: 1,
      },
    },
    tableHeadCell: {
      padding: '16px 1px 16px 16px',
      fontSize: '0.875rem',
      textAlign: 'left',
      verticalAlign: 'inherit',
      color: 'var(--text-secondary)',
      fontWeight: 500,
      lineHeight: '1.5rem',
      borderRight: '1px solid var(--border-primary)',
      '&:last-child': {
        borderRight: 'none',
      },
    },
    resizeHandle: {
      position: 'absolute',
      cursor: 'col-resize',
      zIndex: 100,
      opacity: 0,
      color: 'var(--text-secondary)',
      borderLeft: `1px solid ${theme.palette.primary.light}`,
      borderRight: `1px solid ${theme.palette.primary.light}`,
      height: '50%',
      top: '25%',
      transition: 'all linear 100ms',
      right: -2,
      width: 3,
      '&.handleActive': {
        opacity: '1',
        border: 'none',
        backgroundColor: theme.palette.primary.light,
        height: 'calc(100% - 4px)',
        top: '2px',
        right: -1,
        width: 1,
      },
    },
    tableRow: {
      color: 'var(--text-primary)',
      outline: 0,
      verticalAlign: 'middle',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.07)',
      },
      borderBottom: '1px solid var(--border-primary)',
      '&:last-child': {
        borderBottom: 'none',
      },
      '&.rowSelected': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.07)',
        },
      },
    },
    tableCell: {
      padding: 16,
      fontSize: '0.875rem',
      textAlign: 'left',
      fontWeight: 300,
      lineHeight: 1.43,
      verticalAlign: 'inherit',
      color: 'var(--text-primary)',
      borderRight: '1px solid var(--border-primary)',
      '&:last-child': {
        borderRight: 'none',
      },
    },
    tableSortLabel: {
      '& svg': {
        width: 16,
        height: 16,
        marginTop: 0,
        marginLeft: 2,
      },
    },
    headerIcon: {
      '& svg': {
        width: 16,
        height: 16,
        marginTop: 4,
        marginRight: 0,
      },
    },
    iconDirectionAsc: {
      transform: 'rotate(90deg)',
    },
    iconDirectionDesc: {
      transform: 'rotate(180deg)',
    },
    tableBody: {
      // display: 'flex',
      // flex: '1 1 auto',
      // width: '100%',
      // flexDirection: 'column',
    },
    tableLabel: {},
    cellIcon: {
      '& svg': {
        width: 16,
        height: 16,
        marginTop: 3,
      },
    },
  })
)

const areEqual = (prevProps: any, nextProps: any) =>
  prevProps.checked === nextProps.checked && prevProps.indeterminate === nextProps.indeterminate

export const HeaderCheckbox = React.memo(
  styled(Checkbox)({
    color: 'var(--text-primary)',
    fontSize: '1rem',
    margin: '-8px 0 -8px -15px',
    padding: '8px 9px',
    '& svg': {
      width: '24px',
      height: '24px',
    },
    '&:hover': {
      backgroundColor: 'transparent',
    },
  }),
  areEqual
)

export const RowCheckbox = React.memo(
  styled(Checkbox)({
    color: 'var(--text-primary)',
    fontSize: '14px',
    margin: '-9px 0 -8px -15px',
    padding: '8px 9px 9px 9px',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '& svg': {
      width: 24,
      height: 24,
    },
  }),
  areEqual
)

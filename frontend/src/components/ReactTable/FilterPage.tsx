import { Button, Popover, Typography, createStyles, makeStyles } from '@material-ui/core'
import React, { FormEvent, ReactElement, useCallback } from 'react'
import { TableInstance } from 'react-table'
import styled from 'styled-components'

const useStyles = makeStyles(
  createStyles({
    filtersResetButton: {
      position: 'absolute',
      top: 18,
      right: 21,
    },
    popoverTitle: {
      fontWeight: 500,
      padding: '0 24px 24px 0',
      textTransform: 'uppercase',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 218px)',
      '@media (max-width: 600px)': {
        gridTemplateColumns: 'repeat(1, 180px)',
      },
      gridColumnGap: 24,
      gridRowGap: 24,
    },
    hidden: {
      display: 'none',
    },
  })
)

const StyledDiv = styled.div`
  color: var(--text-secondary);
  background-color: var(--bg-secondary);
  padding: 1rem;
  & MuiFormControl, MuiTextField {
    color: var(--text-secondary);
    background-color: var(--bg-secondary);
  }
`

const CellDiv = styled.div`
  width: 100%;
  display: inline-flex;
  flex-direction: column;
  color: var(--text-secondary);
  background-color: var(--bg-secondary);
`

type FilterPage<T extends object> = {
  instance: TableInstance<T>
  anchorEl?: Element
  onClose: () => void
  show: boolean
}

export function FilterPage<T extends object>({ instance, anchorEl, onClose, show }: FilterPage<T>): ReactElement {
  const classes = useStyles({})
  // @ts-ignore
  const { allColumns, setAllFilters } = instance

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      onClose()
    },
    [onClose]
  )

  const resetFilters = useCallback(() => {
    setAllFilters([])
  }, [setAllFilters])

  return (
    <>
      <Popover
        anchorEl={anchorEl}
        id={'popover-filters'}
        onClose={onClose}
        open={show}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <StyledDiv>
          <Typography className={classes.popoverTitle}>Filters</Typography>
          <form onSubmit={onSubmit}>
            <Button className={classes.filtersResetButton} color='primary' onClick={resetFilters}>
              Reset
            </Button>
            <div className={classes.grid}>
              {allColumns
                // @ts-ignore
                .filter((it) => it.canFilter)
                .map((column) => (
                  <CellDiv key={column.id}>
                    {column.render('Filter')}
                  </CellDiv>
                ))}
            </div>
            <Button className={classes.hidden} type={'submit'}>
              &nbsp;
            </Button>
          </form>
        </StyledDiv>
      </Popover>
    </>
  )
}

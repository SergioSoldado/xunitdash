import { TablePagination as _MuiTablePagination } from '@material-ui/core'
import React, { PropsWithChildren, ReactElement, useCallback } from 'react'
import { TableInstance } from 'react-table'

const rowsPerPageOptions = [5, 10, 25, 50, 100, 250]

// avoid all of the redraws caused by the internal withStyles
const interestingPropsEqual = (prevProps: any, nextProps: any) =>
  prevProps.count === nextProps.count &&
  prevProps.rowsPerPage === nextProps.rowsPerPage &&
  prevProps.page === nextProps.page &&
  prevProps.onChangePage === nextProps.onChangePage &&
  prevProps.onChangeRowsPerPage === nextProps.onChangeRowsPerPage

// a bit of a type hack to keep OverridableComponent working as desired
type T = typeof _MuiTablePagination
const MuiTablePagination: T = React.memo(_MuiTablePagination, interestingPropsEqual) as T

export function TablePagination<T extends object>({
  instance,
}: PropsWithChildren<{ instance: TableInstance<T> }>): ReactElement | null {
  const {
    // @ts-ignore
    state: { pageIndex, pageSize, rowCount = instance.rows.length },
    // @ts-ignore
    gotoPage,
    // @ts-ignore
    nextPage,
    // @ts-ignore
    previousPage,
    // @ts-ignore
    setPageSize,
  } = instance

  const handleChangePage = useCallback(
    // @ts-ignore
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
      if (newPage === pageIndex + 1) {
        nextPage()
      } else if (newPage === pageIndex - 1) {
        previousPage()
      } else {
        gotoPage(newPage)
      }
    },
    [gotoPage, nextPage, pageIndex, previousPage]
  )

  const onChangeRowsPerPage = useCallback(
    (e) => {
      setPageSize(Number(e.target.value))
    },
    [setPageSize]
  )

  return rowCount ? (
    <MuiTablePagination
      rowsPerPageOptions={rowsPerPageOptions}
      component='div'
      count={rowCount}
      rowsPerPage={pageSize}
      page={pageIndex}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={onChangeRowsPerPage}
    />
  ) : null
}

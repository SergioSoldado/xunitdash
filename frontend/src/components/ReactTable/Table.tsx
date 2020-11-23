import { Container, TableSortLabel, TextField } from "@material-ui/core";
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'

import cx from 'classnames'
import React, { CSSProperties, MouseEventHandler, PropsWithChildren, ReactElement, useEffect } from 'react'
import {
  Cell,
  CellProps,
  FilterProps,
  HeaderGroup,
  HeaderProps,
  Hooks,
  Meta,
  Row,
  TableInstance,
  TableOptions, useBlockLayout,
  useColumnOrder,
  useExpanded,
  useFilters,
  // useFlexLayout,
  useGroupBy,
  usePagination,
  useResizeColumns,
  useRowSelect,
  useSortBy,
  useTable
} from "react-table";

import { camelToWords } from '~/lib/objectUtils'
import { useDebounce } from '~/lib/useDebounce'
import { useLocalStorage } from '~/lib/useLocalStorage'
import { DumpInstance } from './DumpInstance'
import { FilterChipBar } from './FilterChipBar'
import { fuzzyTextFilter, numericTextFilter } from './filters'
import { ResizeHandle } from './ResizeHandle'
import { TablePagination } from './TablePagination'
import { HeaderCheckbox, RowCheckbox, useStyles } from './TableStyles'
import { TableToolbar } from './TableToolbar'
import { TooltipCell } from './TooltipCell'

export interface TableProp<T extends object = {}> extends TableOptions<T> {
  name: string
  onAdd?: (instance: TableInstance<T>) => MouseEventHandler
  onDelete?: (instance: TableInstance<T>) => MouseEventHandler
  onEdit?: (instance: TableInstance<T>) => MouseEventHandler
  onClick?: (row: Row<T>) => void
  renderRowSubComponent?: any
}

const DefaultHeader: React.FC<HeaderProps<any>> = ({ column }) => (
  <>{column.id.startsWith('_') ? null : camelToWords(column.id)}</>
)

function DefaultColumnFilter<T extends object>({
  // @ts-ignore
  column: { id, index, filterValue, setFilter, render, parent },
}: FilterProps<T>) {
  const [value, setValue] = React.useState(filterValue || '')
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }
  // ensure that reset loads the new value
  useEffect(() => {
    setValue(filterValue || '')
  }, [filterValue])

  const firstIndex = !(parent && parent.index)
  return (
    <TextField
      name={id}
      label={render('Header')}
      value={value}
      autoFocus={index === 0 && firstIndex}
      variant={'standard'}
      onChange={handleChange}
      onBlur={(e) => {
        setFilter(e.target.value || undefined)
      }}
    />
  )
}

// @ts-ignore
const getStyles = <T extends object>(props: any, disableResizing = false, align = 'left') => [
  props,
  {
    style: {
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'flex-start',
      display: 'flex',
    },
  },
]

// @ts-ignore
const selectionHook = (hooks: Hooks<any>) => {
  hooks.allColumns.push((columns) => [
    // Let's make a column for selection
    {
      id: '_selector',
      disableResizing: true,
      disableGroupBy: true,
      minWidth: 45,
      width: 45,
      maxWidth: 45,
      // The header can use the table's getToggleAllRowsSelectedProps method
      // to render a checkbox
      // @ts-ignore
      Header: ({ getToggleAllRowsSelectedProps }: HeaderProps<any>) => (
        <HeaderCheckbox {...getToggleAllRowsSelectedProps()} />
      ),
      // The cell can use the individual row's getToggleRowSelectedProps method
      // to the render a checkbox
      // @ts-ignore
      Cell: ({ row }: CellProps<any>) => <RowCheckbox {...row.getToggleRowSelectedProps()} />,
    },
    ...columns,
  ])
  hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
    // fix the parent group of the selection button to not be resizable
    const selectionGroupHeader = headerGroups[0].headers[0]
    // @ts-ignore
    selectionGroupHeader.canResize = false
  })
}

const headerProps = <T extends object>(props: any, { column }: Meta<T, { column: HeaderGroup<T> }>) =>
  // @ts-ignore
  getStyles(props, column && column.disableResizing, column && column.align)

const cellProps = <T extends object>(props: any, { cell }: Meta<T, { cell: Cell<T> }>) =>
  // @ts-ignore
  getStyles(props, cell.column && cell.column.disableResizing, cell.column && cell.column.align)

const defaultColumn = {
  Filter: DefaultColumnFilter,
  Cell: TooltipCell,
  Header: DefaultHeader,
  // When using the useFlexLayout:
  minWidth: 30, // minWidth is only used as a limit for resizing
  width: 150, // width is used for both the flex-basis and flex-grow
  maxWidth: 400, // maxWidth is only used as a limit for resizing
}

const hooks = [
  useColumnOrder,
  useFilters,
  useGroupBy,
  useSortBy,
  useExpanded,
  // useFlexLayout,
  useBlockLayout,
  usePagination,
  useResizeColumns,
  useRowSelect,
  // selectionHook,
]

const filterTypes = {
  fuzzyText: fuzzyTextFilter,
  numeric: numericTextFilter,
}

export default function Table<T extends object>(props: PropsWithChildren<TableProp<T>>): ReactElement {
  const { name, columns, onAdd, onDelete, onEdit, onClick, renderRowSubComponent } = props
  const classes = useStyles()

  const [initialState, setInitialState] = useLocalStorage(`tableState:${name}`, {})
  const instance = useTable<T>(
    {
      ...props,
      columns,
      // @ts-ignore
      filterTypes,
      defaultColumn,
      initialState,
    },
    ...hooks
  )

  // @ts-ignore
  const { getTableProps, headerGroups, getTableBodyProps, page, prepareRow, state, visibleColumns } = instance
  const debouncedState = useDebounce(state, 500)

  useEffect(() => {
    const { sortBy, filters, pageSize, columnResizing, hiddenColumns } = debouncedState
    const val = {
      sortBy,
      filters,
      pageSize,
      columnResizing,
      hiddenColumns,
    }
    setInitialState(val)
  }, [setInitialState, debouncedState])

  const cellClickHandler = (cell: Cell<T>) => () => {
    onClick && cell.column.id !== '_selector' && onClick(cell.row)
  }

  return (
    <>
      <TableToolbar instance={instance} {...{ onAdd, onDelete, onEdit }} />
      <FilterChipBar<T> instance={instance} />
      <div className={classes.tableTable} {...getTableProps()}>
        <div>
          {headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps()} className={classes.tableHeadRow}>
              {headerGroup.headers.map((column) => {
                const style = {
                  // @ts-ignore
                  textAlign: column.align ? column.align : 'left ',
                } as CSSProperties
                return (
                  <div {...column.getHeaderProps(headerProps)} className={classes.tableHeadCell}>
                    {/*// @ts-ignore*/}
                    {column.canGroupBy && (
                      <TableSortLabel
                        active
                        // @ts-ignore
                        direction={column.isGrouped ? 'desc' : 'asc'}
                        IconComponent={KeyboardArrowRight}
                        // @ts-ignore
                        {...column.getGroupByToggleProps()}
                        className={classes.headerIcon}
                      />
                    )}
                    {/*// @ts-ignore*/}
                    {column.canSort ? (
                      <TableSortLabel
                        // @ts-ignore
                        active={column.isSorted}
                        // @ts-ignore
                        direction={column.isSortedDesc ? 'desc' : 'asc'}
                        // @ts-ignore
                        {...column.getSortByToggleProps()}
                        className={classes.tableSortLabel}
                        style={style}
                      >
                        {column.render('Header')}
                      </TableSortLabel>
                    ) : (
                      <div style={style} className={classes.tableLabel}>
                        {column.render('Header')}
                      </div>
                    )}
                    {/*// @ts-ignore*/}
                    {column.canResize && <ResizeHandle column={column} />}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <div {...getTableBodyProps()} className={classes.tableBody}>
          {page.map((row) => {
            prepareRow(row)
            return (
              <>
                <div {...row.getRowProps()} className={cx(classes.tableRow, { rowSelected: row.isSelected })}>
                  {row.cells.map((cell) => {
                    return (
                      <div
                        {...cell.getCellProps(cellProps)}
                        onClick={cellClickHandler(cell)}
                        className={classes.tableCell}
                      >
                        {cell.isGrouped ? (
                          <>
                            <TableSortLabel
                              classes={{
                                iconDirectionAsc: classes.iconDirectionAsc,
                                iconDirectionDesc: classes.iconDirectionDesc,
                              }}
                              active
                              direction={row.isExpanded ? 'desc' : 'asc'}
                              IconComponent={KeyboardArrowUp}
                              {...row.getToggleRowExpandedProps()}
                              className={classes.cellIcon}
                            />{' '}
                            {cell.render('Cell')} ({row.subRows.length})
                          </>
                        ) : cell.isAggregated ? (
                          cell.render('Aggregated')
                        ) : cell.isPlaceholder ? null : (
                          cell.render('Cell')
                        )}
                      </div>
                    )
                  })}
                </div>
                {row.isExpanded ? (
                  // <div {...row.getRowProps()} className={cx(classes.tableRow, { rowSelected: row.isSelected })}>
                  <Container>
                    {/*<div colSpan={visibleColumns.length}>*/}
                    {/*
                          Inside it, call our renderRowSubComponent function. In reality,
                          you could pass whatever you want as props to
                          a component like this, including the entire
                          table instance. But for this example, we'll just
                          pass the row
                        */}
                    {renderRowSubComponent? renderRowSubComponent({ row }) : null}
                    {/*</div>*/}
                  </Container>
                ) : null}
              </>
            )
          })}
        </div>
      </div>
      <TablePagination<T> instance={instance} />
      <DumpInstance enabled instance={instance} />
    </>
  )
}

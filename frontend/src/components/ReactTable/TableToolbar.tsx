import { Button, IconButton, Toolbar, Tooltip, createStyles, makeStyles } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import CreateIcon from '@material-ui/icons/CreateOutlined'
import DeleteIcon from '@material-ui/icons/DeleteOutline'
import FilterListIcon from '@material-ui/icons/FilterList'
import ViewColumnsIcon from '@material-ui/icons/ViewColumn'

import classnames from 'classnames'
import React, { MouseEvent, MouseEventHandler, PropsWithChildren, ReactElement, useCallback, useState } from 'react'
import { TableInstance } from 'react-table'

// import { TableMouseEventHandler } from '../types/react-table-config'
import { ColumnHidePage } from './ColumnHidePage'
import { FilterPage } from './FilterPage'


// @ts-ignore
export const useStyles = makeStyles(() =>
  createStyles({
    toolbar: {
      color: 'var(--text-primary)',
      display: 'flex',
      justifyContent: 'space-between',
    },
    leftButtons: {},
    rightButtons: {},
    leftIcons: {
      color: 'var(--text-primary)',
      '&:first-of-type': {
        marginLeft: -12,
      },
    },
    rightIcons: {
      color: 'var(--text-primary)',
      padding: 12,
      marginTop: '-6px',
      width: 48,
      height: 48,
      '&:last-of-type': {
        marginRight: -12,
      },
    },
  })
)


type InstanceActionButton<T extends object> = {
  instance: TableInstance<T>
  icon?: JSX.Element
  // onClick: TableMouseEventHandler
  onClick: any
  enabled?: (instance: TableInstance<T>) => boolean
  label: string
  variant?: 'right' | 'left'
}

// @ts-ignore
type ActionButton<T extends object> = {
  icon?: JSX.Element
  onClick: MouseEventHandler
  enabled?: boolean
  label: string
  variant?: 'right' | 'left'
}

export const InstanceLabeledActionButton = <T extends object>({
  instance,
  icon,
  onClick,
  label,
  enabled = () => true,
}: InstanceActionButton<T>): ReactElement => {
  return (
    <Button variant='contained' color='primary' onClick={onClick(instance)} disabled={!enabled(instance)}>
      {icon}
      {label}
    </Button>
  )
}

export const LabeledActionButton = <T extends object>({
  icon,
  onClick,
  label,
  enabled = true,
}: ActionButton<T>): ReactElement => {
  return (
    <Button variant='contained' color='primary' onClick={onClick} disabled={!enabled}>
      {icon}
      {label}
    </Button>
  )
}

export const InstanceSmallIconActionButton = <T extends object>({
  instance,
  icon,
  onClick,
  label,
  enabled = () => true,
  variant,
}: InstanceActionButton<T>) => {
  const classes = useStyles({})
  return (
    <Tooltip title={label} aria-label={label}>
      <span>
        <IconButton
          className={classnames({ [classes.rightIcons]: variant === 'right', [classes.leftIcons]: variant === 'left' })}
          onClick={onClick(instance)}
          disabled={!enabled(instance)}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  )
}

export const SmallIconActionButton = <T extends object>({
  icon,
  onClick,
  label,
  enabled = true,
  variant,
}: ActionButton<T>) => {
  const classes = useStyles({})
  return (
    <Tooltip title={label} aria-label={label}>
      <span>
        <IconButton
          className={classnames({ [classes.rightIcons]: variant === 'right', [classes.leftIcons]: variant === 'left' })}
          onClick={onClick}
          disabled={!enabled}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  )
}

type TableToolbar<T extends object> = {
  instance: TableInstance<T>
  // onAdd?: TableMouseEventHandler
  // onDelete?: TableMouseEventHandler
  // onEdit?: TableMouseEventHandler
  onAdd?: any
  onDelete?: any
  onEdit?: any
}

export function TableToolbar<T extends object>({
  instance,
  onAdd,
  onDelete,
  onEdit,
}: PropsWithChildren<TableToolbar<T>>): ReactElement | null {
  const { columns } = instance
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<Element | undefined>(undefined)
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const hideableColumns = columns.filter((column) => !(column.id === '_selector'))

  const handleColumnsClick = useCallback(
    (event: MouseEvent) => {
      setAnchorEl(event.currentTarget)
      setColumnsOpen(true)
    },
    [setAnchorEl, setColumnsOpen]
  )

  const handleFilterClick = useCallback(
    (event: MouseEvent) => {
      setAnchorEl(event.currentTarget)
      setFilterOpen(true)
    },
    [setAnchorEl, setFilterOpen]
  )

  const handleClose = useCallback(() => {
    setColumnsOpen(false)
    setFilterOpen(false)
    setAnchorEl(undefined)
  }, [])

  // toolbar with add, edit, delete, filter/search column select.
  return (
    <Toolbar className={classes.toolbar}>
      <div className={classes.rightButtons}>
        <ColumnHidePage<T> instance={instance} onClose={handleClose} show={columnsOpen} anchorEl={anchorEl} />
        <FilterPage<T> instance={instance} onClose={handleClose} show={filterOpen} anchorEl={anchorEl} />
        {hideableColumns.length > 1 && (
          <SmallIconActionButton<T>
            icon={<ViewColumnsIcon />}
            onClick={handleColumnsClick}
            label='Show / hide columns'
            variant='left'
          />
        )}
        <SmallIconActionButton<T>
          icon={<FilterListIcon />}
          onClick={handleFilterClick}
          label='Filter by columns'
          variant='left'
        />
      </div>
      <div className={classes.leftButtons}>
        {onAdd && (
          <InstanceSmallIconActionButton<T>
            instance={instance}
            icon={<AddIcon />}
            onClick={onAdd}
            label='Add'
            enabled={({ state }: TableInstance<T>) =>
              // @ts-ignore
              !state.selectedRowIds || Object.keys(state.selectedRowIds).length === 0
            }
            variant='right'
          />
        )}
        {onEdit && (
          <InstanceSmallIconActionButton<T>
            instance={instance}
            icon={<CreateIcon color="inherit" />}
            onClick={onEdit}
            label='Edit'
            enabled={({ state }: TableInstance<T>) =>
              // @ts-ignore
              state.selectedRowIds && Object.keys(state.selectedRowIds).length === 1
            }
            variant='right'
          />
        )}
        {onDelete && (
          <InstanceSmallIconActionButton<T>
            instance={instance}
            icon={<DeleteIcon />}
            onClick={onDelete}
            label='Delete'
            enabled={({ state }: TableInstance<T>) =>
              // @ts-ignore
              state.selectedRowIds && Object.keys(state.selectedRowIds).length > 0
            }
            variant='right'
          />
        )}
      </div>
    </Toolbar>
  )
}

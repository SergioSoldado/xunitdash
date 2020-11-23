import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import styled from 'styled-components'

const StyledCell = styled(TableCell)`
  color: var(--text-primary);
`

interface Props {
  tableHead: any[]
  tableData: any[]
}

export default function TableComp(props: Props): React.ReactElement {
  const { tableHead, tableData } = props

  const TableHeadComp =
    tableHead !== undefined ? (
      <TableHead>
        <TableRow>
          {tableHead.map((prop, key) => {
            return <StyledCell key={key}>{prop}</StyledCell>
          })}
        </TableRow>
      </TableHead>
    ) : null

  return (
    <Table>
      {TableHeadComp}
      <TableBody>
        {tableData.map((prop, key) => {
          if (Array.isArray(prop)) {
            return (
                <TableRow key={key} hover>
                  {prop.map((prop, key) => {
                    return <StyledCell key={key}>{prop}</StyledCell>
                  })}
                </TableRow>
            )
          } else {
            return (<TableRow key={key} hover>
              {Object.keys(prop).map((key) => {
                return <StyledCell key={key}>{prop[key]}</StyledCell>
              })}
            </TableRow>)
          }
        })}
      </TableBody>
    </Table>
  )
}

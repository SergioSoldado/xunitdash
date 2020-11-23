import React, { ReactElement } from 'react'
import { TestRunData } from '~/lib/junit/types'
import TestRunCard from '~/components/JUnit/TestRunCard'

interface Props {
  data: Array<TestRunData>
  page: number
  itemsPerPage: number
}

export default function TestRunCards(props: Props): ReactElement {
  const { data, itemsPerPage, page } = props

  const components = React.useMemo(() => {
    console.log('Regetting cards')
    return data
      .slice((page - 1) * itemsPerPage, Math.min(page * itemsPerPage, data.length))
      .map((item) => <TestRunCard key={item.id} item={item} />)
  }, [data, page, itemsPerPage])

  return <React.Fragment>{components}</React.Fragment>
}

import React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import { FallbackStyles, MagicScriptTag } from '~/components/Theme/InlineCssVariables'
import Providers from '~/components/Providers'
import DarkModeToggleIcon from '~/components/DarkModeToggleIcon'
import ReactTable  from './Table'
import { Column } from 'react-table'

const Container = styled.div`
  margin: 1rem;
`

const columns: Array<Column> = [
  {
    Header: 'ID',
    accessor: 'id',
  },
  {
    Header: 'name',
    accessor: 'name',
  },
  {
    Header: 'Gender',
    accessor: 'gender',
  },
  {
    Header: 'Address',
    accessor: 'ip_address',
  },
]

storiesOf('ReactTable', module).add('Simple', () => (
  <Providers>
    <DarkModeToggleIcon />
    <FallbackStyles />
    <MagicScriptTag />
    <Container>
      <ReactTable name="simple" columns={columns} data={data} />
    </Container>
  </Providers>
))

const data = [{"id":1,"name":"Franchot","age":71,"gender":"Male","ip_address":"185.180.255.159"},
  {"id":2,"name":"Lorene","age":31,"gender":"Female","ip_address":"250.216.211.255"},
  {"id":3,"name":"Ann","age":20,"gender":"Female","ip_address":"187.169.166.174"},
  {"id":4,"name":"Jase","age":41,"gender":"Male","ip_address":"99.184.236.152"},
  {"id":5,"name":"Maryanne","age":26,"gender":"Female","ip_address":"12.187.99.21"},
  {"id":6,"name":"Arlin","age":79,"gender":"Male","ip_address":"137.169.95.145"},
  {"id":7,"name":"Carla","age":29,"gender":"Female","ip_address":"238.135.212.110"},
  {"id":8,"name":"Franky","age":69,"gender":"Male","ip_address":"249.4.31.184"},
  {"id":9,"name":"Jarid","age":85,"gender":"Male","ip_address":"115.44.26.21"},
  {"id":10,"name":"Nomi","age":38,"gender":"Female","ip_address":"247.245.173.35"},
  {"id":11,"name":"Mariele","age":55,"gender":"Female","ip_address":"217.142.96.60"},
  {"id":12,"name":"Oralee","age":59,"gender":"Female","ip_address":"78.140.123.15"},
  {"id":13,"name":"Obediah","age":44,"gender":"Male","ip_address":"142.152.44.7"},
  {"id":14,"name":"Layla","age":29,"gender":"Female","ip_address":"62.79.216.180"},
  {"id":15,"name":"Craggy","age":73,"gender":"Male","ip_address":"91.206.186.194"},
  {"id":16,"name":"Merry","age":83,"gender":"Male","ip_address":"85.174.22.66"},
  {"id":17,"name":"Laurens","age":52,"gender":"Male","ip_address":"251.24.52.174"},
  {"id":18,"name":"Edith","age":63,"gender":"Female","ip_address":"96.208.57.187"},
  {"id":19,"name":"Hilliard","age":71,"gender":"Male","ip_address":"103.185.191.210"},
  {"id":20,"name":"Tiphanie","age":77,"gender":"Female","ip_address":"58.234.254.21"},
  {"id":21,"name":"Myrilla","age":78,"gender":"Female","ip_address":"108.31.157.86"},
  {"id":22,"name":"Maible","age":26,"gender":"Female","ip_address":"55.66.179.19"},
  {"id":23,"name":"Rivi","age":71,"gender":"Female","ip_address":"118.254.249.158"},
  {"id":24,"name":"Carma","age":64,"gender":"Female","ip_address":"51.222.61.47"},
  {"id":25,"name":"Rufus","age":57,"gender":"Male","ip_address":"48.248.142.89"},
  {"id":26,"name":"Edgard","age":77,"gender":"Male","ip_address":"253.106.144.69"},
  {"id":27,"name":"Leeann","age":57,"gender":"Female","ip_address":"78.150.162.137"},
  {"id":28,"name":"Ainsley","age":19,"gender":"Female","ip_address":"151.68.38.49"},
  {"id":29,"name":"Nicola","age":39,"gender":"Female","ip_address":"79.80.15.144"},
  {"id":30,"name":"Margarita","age":80,"gender":"Female","ip_address":"25.124.184.95"},
  {"id":31,"name":"Theda","age":49,"gender":"Female","ip_address":"212.108.169.126"},
  {"id":32,"name":"Karim","age":64,"gender":"Male","ip_address":"141.51.186.17"},
  {"id":33,"name":"Antonetta","age":61,"gender":"Female","ip_address":"51.16.32.141"},
  {"id":34,"name":"Norry","age":22,"gender":"Male","ip_address":"145.55.226.77"},
  {"id":35,"name":"Neron","age":68,"gender":"Male","ip_address":"60.151.56.76"},
  {"id":36,"name":"Zaccaria","age":58,"gender":"Male","ip_address":"43.69.39.125"},
  {"id":37,"name":"Barnabas","age":58,"gender":"Male","ip_address":"247.47.137.83"},
  {"id":38,"name":"Rosie","age":80,"gender":"Female","ip_address":"190.168.9.31"},
  {"id":39,"name":"Yuri","age":60,"gender":"Male","ip_address":"167.174.146.169"},
  {"id":40,"name":"Theressa","age":30,"gender":"Female","ip_address":"33.124.228.60"},
  {"id":41,"name":"Joby","age":39,"gender":"Female","ip_address":"39.63.232.38"},
  {"id":42,"name":"Devlen","age":26,"gender":"Male","ip_address":"116.69.70.159"},
  {"id":43,"name":"Patti","age":35,"gender":"Female","ip_address":"129.217.235.104"},
  {"id":44,"name":"Hobart","age":47,"gender":"Male","ip_address":"103.78.105.75"},
  {"id":45,"name":"Cathrin","age":22,"gender":"Female","ip_address":"12.159.23.252"},
  {"id":46,"name":"Papageno","age":79,"gender":"Male","ip_address":"55.73.122.43"},
  {"id":47,"name":"Blaine","age":27,"gender":"Male","ip_address":"17.47.137.75"},
  {"id":48,"name":"Kermy","age":63,"gender":"Male","ip_address":"101.63.74.180"},
  {"id":49,"name":"Kaitlin","age":18,"gender":"Female","ip_address":"39.41.56.206"},
  {"id":50,"name":"Al","age":29,"gender":"Male","ip_address":"73.49.44.67"},
  {"id":51,"name":"Toby","age":24,"gender":"Male","ip_address":"64.182.123.115"},
  {"id":52,"name":"Judas","age":38,"gender":"Male","ip_address":"160.60.163.163"},
  {"id":53,"name":"Rhys","age":46,"gender":"Male","ip_address":"114.89.21.144"},
  {"id":54,"name":"Rani","age":79,"gender":"Female","ip_address":"99.55.85.71"},
  {"id":55,"name":"Fannie","age":36,"gender":"Female","ip_address":"196.76.238.185"},
  {"id":56,"name":"Bird","age":48,"gender":"Female","ip_address":"212.124.20.255"},
  {"id":57,"name":"Eliza","age":42,"gender":"Female","ip_address":"7.27.82.125"},
  {"id":58,"name":"Calhoun","age":77,"gender":"Male","ip_address":"199.1.87.131"},
  {"id":59,"name":"Estele","age":41,"gender":"Female","ip_address":"134.68.217.131"},
  {"id":60,"name":"Rosamund","age":43,"gender":"Female","ip_address":"225.185.243.142"},
  {"id":61,"name":"Alva","age":53,"gender":"Male","ip_address":"252.198.137.232"},
  {"id":62,"name":"Conroy","age":77,"gender":"Male","ip_address":"138.69.128.255"},
  {"id":63,"name":"Vassily","age":49,"gender":"Male","ip_address":"161.110.148.99"},
  {"id":64,"name":"Nikos","age":45,"gender":"Male","ip_address":"119.123.158.136"},
  {"id":65,"name":"Terri","age":21,"gender":"Male","ip_address":"233.18.145.215"},
  {"id":66,"name":"Vinnie","age":39,"gender":"Female","ip_address":"233.143.228.113"},
  {"id":67,"name":"Pauletta","age":67,"gender":"Female","ip_address":"104.4.85.133"},
  {"id":68,"name":"Zonnya","age":23,"gender":"Female","ip_address":"199.232.35.7"},
  {"id":69,"name":"Yancey","age":31,"gender":"Male","ip_address":"181.175.80.181"},
  {"id":70,"name":"Eadie","age":40,"gender":"Female","ip_address":"182.56.128.82"},
  {"id":71,"name":"Lorne","age":67,"gender":"Female","ip_address":"111.7.198.135"},
  {"id":72,"name":"Rachel","age":48,"gender":"Female","ip_address":"39.204.67.224"},
  {"id":73,"name":"Clair","age":41,"gender":"Male","ip_address":"164.168.51.165"},
  {"id":74,"name":"Brendan","age":40,"gender":"Male","ip_address":"125.90.120.239"},
  {"id":75,"name":"Orin","age":73,"gender":"Male","ip_address":"189.94.137.120"},
  {"id":76,"name":"Josy","age":51,"gender":"Female","ip_address":"180.40.192.228"},
  {"id":77,"name":"Salomone","age":69,"gender":"Male","ip_address":"97.96.200.225"},
  {"id":78,"name":"Justis","age":27,"gender":"Male","ip_address":"75.7.195.105"},
  {"id":79,"name":"Vikky","age":31,"gender":"Female","ip_address":"107.28.249.197"},
  {"id":80,"name":"Jon","age":62,"gender":"Male","ip_address":"235.201.142.44"},
  {"id":81,"name":"Laverna","age":30,"gender":"Female","ip_address":"98.218.211.58"},
  {"id":82,"name":"Meredith","age":77,"gender":"Male","ip_address":"156.226.28.180"},
  {"id":83,"name":"Deck","age":26,"gender":"Male","ip_address":"221.90.122.78"},
  {"id":84,"name":"Geri","age":69,"gender":"Male","ip_address":"187.89.202.174"},
  {"id":85,"name":"Carolee","age":57,"gender":"Female","ip_address":"201.78.228.147"},
  {"id":86,"name":"Matthew","age":75,"gender":"Male","ip_address":"237.176.97.72"},
  {"id":87,"name":"Bell","age":60,"gender":"Female","ip_address":"200.35.107.84"},
  {"id":88,"name":"Mufinella","age":74,"gender":"Female","ip_address":"137.83.7.87"},
  {"id":89,"name":"Patience","age":62,"gender":"Female","ip_address":"111.83.215.102"},
  {"id":90,"name":"Sylvan","age":74,"gender":"Male","ip_address":"12.130.194.211"},
  {"id":91,"name":"Tersina","age":34,"gender":"Female","ip_address":"24.126.35.20"},
  {"id":92,"name":"Brandise","age":31,"gender":"Female","ip_address":"151.92.172.159"},
  {"id":93,"name":"Linzy","age":49,"gender":"Female","ip_address":"202.231.218.211"},
  {"id":94,"name":"Angela","age":51,"gender":"Female","ip_address":"212.160.251.233"},
  {"id":95,"name":"Lauraine","age":23,"gender":"Female","ip_address":"213.161.103.139"},
  {"id":96,"name":"Tomi","age":39,"gender":"Female","ip_address":"173.29.54.97"},
  {"id":97,"name":"Edee","age":69,"gender":"Female","ip_address":"97.95.133.55"},
  {"id":98,"name":"Callie","age":30,"gender":"Female","ip_address":"236.57.135.43"},
  {"id":99,"name":"Aimee","age":20,"gender":"Female","ip_address":"126.151.150.60"},
  {"id":100,"name":"Vale","age":61,"gender":"Male","ip_address":"241.204.212.117"}]
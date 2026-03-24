import { Card, Col, Row, Statistic } from 'antd'
import ReactECharts from 'echarts-for-react'

const chartOption = {
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  yAxis: { type: 'value' },
  series: [
    {
      data: [320, 432, 501, 534, 690, 830, 920],
      type: 'line',
      smooth: true,
      areaStyle: {},
    },
  ],
}

function DashboardPage() {
  return (
    <Row gutter={[16, 16]}>
      {[
        { title: '今日访问', value: 1024 },
        { title: '本周新增', value: 268 },
        { title: '待审批', value: 19 },
        { title: '异常告警', value: 3 },
      ].map((item) => (
        <Col key={item.title} xs={24} sm={12} xl={6}>
          <Card className="page-card">
            <Statistic title={item.title} value={item.value} />
          </Card>
        </Col>
      ))}
      <Col xs={24}>
        <Card className="page-card" title="访问趋势">
          <ReactECharts option={chartOption} style={{ height: 360 }} />
        </Card>
      </Col>
    </Row>
  )
}

export default DashboardPage

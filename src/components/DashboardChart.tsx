import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const lineData = [
  { name: 'Luni', peakHour: 14, avgHour: 11 },
  { name: 'Marti', peakHour: 16, avgHour: 12 },
  { name: 'Miercuri', peakHour: 15, avgHour: 10 },
  { name: 'Joi', peakHour: 17, avgHour: 13 },
  { name: 'Vineri', peakHour: 18, avgHour: 14 },
  { name: 'Sambata', peakHour: 12, avgHour: 9 },
  { name: 'Duminica', peakHour: 11, avgHour: 8 },
]

const barData = [
  { name: 'Mon', visits: 2400, conversions: 400 },
  { name: 'Tue', visits: 1398, conversions: 300 },
  { name: 'Wed', visits: 9800, conversions: 800 },
  { name: 'Thu', visits: 3908, conversions: 700 },
  { name: 'Fri', visits: 4800, conversions: 900 },
  { name: 'Sat', visits: 3800, conversions: 600 },
  { name: 'Sun', visits: 4300, conversions: 500 },
]

const pieData = [
  { name: 'Desktop', value: 400, color: 'hsl(262, 83%, 58%)' },
  { name: 'Mobile', value: 300, color: 'hsl(252, 83%, 68%)' },
  { name: 'Tablet', value: 200, color: 'hsl(242, 83%, 78%)' },
  { name: 'Other', value: 100, color: 'hsl(232, 83%, 88%)' },
]

const areaData = [
  { name: '00:00', users: 0 },
  { name: '04:00', users: 150 },
  { name: '08:00', users: 800 },
  { name: '12:00', users: 1200 },
  { name: '16:00', users: 900 },
  { name: '20:00', users: 600 },
  { name: '24:00', users: 200 },
]

export function RevenueChart() {
  return (
    <Card className="col-span-full lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Volum Apeluri</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 24]}
                tickFormatter={(value) => `${value}:00`}
              />
              <Line 
                type="monotone" 
                dataKey="peakHour" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                name="Ora de vârf"
              />
              <Line 
                type="monotone" 
                dataKey="avgHour" 
                stroke="hsl(var(--primary-glow))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Ora medie"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function VisitorChart() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Daily Visitors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Bar 
                dataKey="visits" 
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                className="opacity-80 hover:opacity-100 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function DeviceChart() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Device Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {pieData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function UserActivityChart() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">User Activity (24h)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="hsl(var(--primary))"
                fill="url(#colorUsers)"
                fillOpacity={0.6}
              />
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
export class TradeViewSettings {
  public settings = {
    config: {
      scrollZoom: true,
      responsive: true,
      displayModeBar: true
    },
    data: [] as any,
    layout: {
      legend: {
        x: 0,
        y: 1,
        traceorder: 'normal',
        font: {
          family: 'hyundai-card',
          size: 9,
          color: 'white'
        },
        bgcolor: '020922',
      },
      plot_bgcolor: "#131722",
      paper_bgcolor: "#131722",
      //   autosize: true,
      // width: '100%',
      height: '300',

      margin: {
        r: 40,
        t: 40,
        b: 40,
        l: 60
      },
      dragmode: "pan",
      xaxis: {
        autorange: false,
        rangeselector: {
          xanchor: "left",
          font: { size: 8 },
        },
        range: [] as any,
        rangeslider: {
          visible: false,
          range: [] as any
        },
        type: "date",
        tickcolor: "#787878",
        linecolor: "#787878",
        gridcolor: "#363c4e",
        titlefont: {
          family: "hyundai-card",
          size: 14,
          color: "#cccdcd"
        },
        tickfont: {
          family: "hyundai-card",
          size: 12,
          color: "#cccdcd"
        }
      },
      yaxis: {
        floor: 0,
        autorange: false,
        range: [] as any,
        type: "linear",
        tickcolor: "#787878",
        linecolor: "#787878",
        gridcolor: "#363c4e",
        titlefont: {
          family: "hyundai-card",
          size: 14,
          color: "#cccdcd"
        },
        tickfont: {
          family: "hyundai-card",
          size: 12,
          color: "#cccdcd"
        },
        title: "가격"
      },
      annotations: [
      ],
      shapes: [] as any
    }
  };
}

export interface priceData {
  code: string,
  date: string,
  open: number,
  high: number,
  low: number,
  close: number,
  diff: number,
  volume: number
}

export interface signalData {
  code: string,
  date: string,
  type: string,
  close: number,
  valid: string,
  last_buy_close: number,
  last_buy_date: string,
  last_sell_close: number,
  last_sell_date: string,
  first_buy_date: string,
  _period_latest: number,
  _period_first: number,
  _rank: number,
  _returns: number,
  buy_count: number
}

export interface momentumData {
  code: string,
  company: string,
  rate: string
}

export interface bollingerData {
  code: string,
  date: string,
  ma20: number,
  stddev: number,
  upper: number,
  lower: number,
  pb: number,
  bandwidth: number,
  mfi10: number,
  iip21: number
}

export interface tripleScreenData {
  code: string,
  date: string,
  ema130: number,
  ema60: number,
  macd: number,
  _signal: number,
  macdhist: number,
  fast_k: number,
  slow_d: number
}
import * as d3 from 'd3';
import React from 'react';
import './curevExplorer.css';

// 曲線の種類のための型
type CurveType = {
  // 曲線の名前
  name:string
  // lineGeneratorに設定する曲線の種類
  curve: d3.CurveFactory| d3.CurveBundleFactory
  // これがactiveなら描画されるように作っていく
  active:boolean
  // <path d={this.lineString}></path>のようになる。
  lineString:string
  // ホバーしたときに表示される情報
  info:string
}

export class CurveExplorer extends React.Component{

  // 点を描画する。

  // データとしての点の初期値
  private points:[number,number][] = [ [50, 330], [75, 200], [280, 75], [300, 75], [475, 300], [600, 200] ]
  // 画面に表示される点の数の初期値
  private numActivePoints = this.points.length
  // 点がドラッグされたときの処理を設定する
  private drag = d3.drag<SVGCircleElement,[number,number]>()
  .on('drag', (event, point) => {
          // ドラッグされると点の位置を更新する
          point[0] = event.x
          point[1] = event.y
          // SVGを更新
          this.update()
  })
  // SVG上に描画される点を更新する処理
  private updatePoints = () => {
      // 画面に表示される点
      let renderedPoints = this.points.slice(0, this.numActivePoints)
      // SVGタグの中の最初のgタグをセレクト
      let u = d3.select('g')
          // そのなかのcircleタグ要素と画面に表示される点をバインドする。
          // 初めて描画されるときはまだ'circle'要素は存在しない。
          .selectAll<SVGCircleElement, [number,number]>('circle')
          .data(renderedPoints)
      // 既に存在するcircle要素のうち
      // renderedPointsの数以上に存在するものを消す
      u.exit().remove()
      // 既に存在するcircle要素が足りなかったら追加する
      u.enter().append('circle')
      // 表示されているSVGのcirecleを
      // 現在のrenderedPointsの値に更新する
      .merge(u)
      // ドラッグされたときの振る舞いを追加する。
      // callについてもっと知りたい時は
      // https://github.com/d3/d3-selection/blob/v2.0.0/README.md#selection_call
      // を参照してください。
      .call(this.drag)
      // 描画される位置を指定する
      .attr('cx', (point) => { return point[0]})
      .attr('cy', (point) => { return point[1]})
      // 半径を4pxに指定する
      .attr('r', 4)

  }
  // 表示される点の数を更新する処理
  private updatePointsMenu = () => {
      // .remove-pointクラスのアイテムのプロパティの値を更新する
      d3.select('.remove-point')
          // クリックされると表示される点の数が一つ減る
          .classed('clickable', this.numActivePoints > 2)
          .on('click', () => {
              if(this.numActivePoints <= 2) return
              this.numActivePoints--
              this.update()
          })
      // .add-pointクラスのアイテムのプロパティの値を更新する
      d3.select('.add-point')
          // クリックされると表示される点の数が一つ減る
          .classed('clickable', this.numActivePoints < this.points.length)
          .on('click', () => {
              if(this.numActivePoints >= this.points.length) return
              this.numActivePoints++
              this.update()
          })
  }

  // 線を描画する。

  // 色々な種類の線を設定する。
  // active=trueになっている種類のcurveが表示されるようにしていく。
  // infoに線の種類の説明が書かれている。
  private curveTypes:CurveType[] = [
      {name: 'curveLinear', curve: d3.curveLinear, active: true, lineString: '', info: 'Interpolates the points using linear segments.'},
      {name: 'curveBasis', curve: d3.curveBasis, active: true, lineString: '',  info: 'Interpolates the start and end points and approximates the inner points using a B-spline.'},
      {name: 'curveBasisClosed', curve: d3.curveBasisClosed, active: false, lineString: '', info: 'Uses a closed B-Spline to approximate the points.'},
      {name: 'curveBundle (ß=0)', curve: d3.curveBundle.beta(0), active: false, lineString: '',  info: 'Same as curveBasis with the addition of a paramter ß which determines how close to a straight line the curve is. If ß=0 the curve is straight.'},
      {name: 'curveBundle (ß=0.5)', curve: d3.curveBundle.beta(0.5), active: false, lineString: '', info: 'Same as curveBasis with the addition of a paramter ß which determines how close to a straight line the curve is.'},
      {name: 'curveBundle (ß=1)', curve: d3.curveBundle.beta(1), active: false, lineString: '', info: 'Same as curveBasis with the addition of a paramter ß which determines how close to a straight line the curve is. If ß=1 the curve is the same as curveBasis.'},
      {name: 'curveCardinal (tension=0)', curve: d3.curveCardinal.tension(0), active: false, lineString: '',  info: "Interpolates the points using a cubic B-spline. A tension parameter determines how 'taut' the curve is. As tension approaches 1 the segments become linear."},
      {name: 'curveCardinal (tension=0.5)', curve: d3.curveCardinal.tension(0.5), active: false, lineString: '', info: "Interpolates the points using a cubic B-spline. A tension parameter determines how 'taut' the curve is. As tension approaches 1 the segments become linear."},
      {name: 'curveCardinal (tension=1)', curve: d3.curveCardinal.tension(1), active: false, lineString: '', info: "Interpolates the points using a cubic B-spline. A tension parameter determines how 'taut' the curve is. As tension approaches 1 the segments become linear."},
      {name: 'curveCatmullRom (α=0)', curve: d3.curveCatmullRom.alpha(0), active: false, lineString: '',  info: 'Similar to curveCardinal (tension=0) but with a parameter α that determines the parameterisation used to interpolate the points. If α=0 the parameterisation is uniform.'},
      {name: 'curveCatmullRom (α=0.5)', curve: d3.curveCatmullRom.alpha(0.5), active: false, lineString: '', info: 'Similar to curveCardinal (tension=0) but with a parameter α that determines the parameterisation used to interpolate the points. If α=0.5 the parameterisation is centripetal and self intersecting loops are avoided.'},
      {name: 'curveCatmullRom (α=1)', curve: d3.curveCatmullRom.alpha(1), active: false, lineString: '', info: 'Similar to curveCardinal (tension=0) but with a parameter α that determines the parameterisation used to interpolate the points. If α=1 the parameterisation is chordal.'},
      {name: 'curveMonotoneX', curve: d3.curveMonotoneX, active: false, lineString: '',  info: 'Interpolates the points with a cubic spline which are monotonic (i.e. always increasing or always decreasing) in y.'},
      {name: 'curveMonotoneY', curve: d3.curveMonotoneY, active: false, lineString: '', info: 'Interpolates the points with a cubic spline which are monotonic (i.e. always increasing or always decreasing) in x.'},
      {name: 'curveNatural', curve: d3.curveNatural, active: false, lineString: '',  info: 'Interpolates the points with a cubic spline with zero 2nd derivatives at the endpoints.'},
      {name: 'curveStep', curve: d3.curveStep, active: false, lineString: '',  info: 'Interpolates the points with alternating horizontal and vertical linear segments. The vertical segments lie midway between points.'},
      {name: 'curveStepAfter', curve: d3.curveStepAfter, active: false, lineString: '', info: 'Interpolates the points with alternating horizontal and vertical linear segments. The y value changes after the x value.'},
      {name: 'curveStepBefore', curve: d3.curveStepBefore, active: false, lineString: '', info: 'Interpolates the points with alternating horizontal and vertical linear segments. The y value changes before the x value.'}
  ]


  // まず、線の色のパレットを作っておく。

  // 10色のパレットの目盛りを与える。
  // this.categoryScale("1023") == this.categoryScale("3")
  private categoryScale = d3.scaleOrdinal(d3.schemeCategory10)
  // d3.scaleOrdinal(d3.schemeCategory10)はstring型しか受け付けないので
  // number型を変換するアダプターを被せる
  private colorScale = (i:number)=> {return this.categoryScale(i.toString())}

  // 線を生成してくれるもの
  private lineGenerator = d3.line()

  // 線を更新する処理
  updateLines = ()=>{
      // curveTypesのうち active=true のものを更新する
      this.curveTypes.forEach((d)=> {
          if(!d.active){
              return
          }
          // 表示される点からlineStringを作る
          // "M50,330L75,200L280,75L295,171L475,300L600,200"みたいなやつ
          let renderedPoints = this.points.slice(0, this.numActivePoints)
          // lineGeneratorに曲線の種類を設定する。
          this.lineGenerator.curve(d.curve)
          let lineString :string|null =  this.lineGenerator(renderedPoints)
          d.lineString = lineString?lineString:""
      })

      // SVGのなかの最初のgタグを選択
      let u = d3.select('g')
          // そのなかのpathタグ要素とcurveTypesをバインドする。
          // 初めて描画されるときはまだ'path'要素は存在しない。
          .selectAll<SVGPathElement, [number, number]>('path')
          .data(this.curveTypes)
      // 既に存在するpath要素が足りなかったら追加する
      // (初回のみ使われる)
      u.enter().append('path')
          // 表示されているSVGのpathを
          // 現在のcurveTypesの値に更新する
          .merge(u)
          // 曲線の色の値を指定する。
          .style('stroke', (d, i) => { return this.colorScale(i)})
          // 'd'プロパティの値をしていする。
          .attr('d', function(d) { return d.lineString})
          // active==true じゃなかったら表示しない
          .style('display', function(d) { return d.active ? 'inline' : 'none'})
  }


  // Infoのテキストを更新する。
  updateInfo = (info:string) => {
      d3.select('.info .default').style('display', info ? 'none' : 'inline')
      d3.select('.info .text').text(info)
  }

  // 表示する線の種類を選ぶメニューを更新する。
  // 飽きてきたので詳細は省くが上とほぼ同じ。
  updateLinesMenu = ()=>{
      let u = d3.select('.menu')
          .selectAll<HTMLDivElement,number[]>('div.item')
          .data(this.curveTypes)

      u.enter()
          .append('div')
          .merge(u)
          .classed('item', true)
          .text(function(d) { return d.name })
          .on('click', (event,d)=> {
              d.active = !d.active
              this.update()
          })
          .on("mouseover", (event,curveType)=> { this.updateInfo(curveType.info) })
          .on('mouseout', ()=> { this.updateInfo('') })
          .style('background-color', (d, i) => { return d.active ? this.colorScale(i) : '#fff' })
          .style('color', (d) => { return d.active ? 'white' : '#444' })
  }

  // 更新する処理全てをまとめたもの
  update = () => {
      this.updatePoints()
      this.updatePointsMenu()
      this.updateLines()
      this.updateLinesMenu()
  }

  componentDidMount = () => {
      this.update()

  }
  render = () => {
      return (
          <div id="CurveExplorer">
              <svg width="700" height="400">
                  <g>
                      <g className="points-menu" transform="translate(660, 380)">
                          <g className="remove-point">
                              <rect x="-6" y="-6" width="12" height="12"></rect>
                              <line x1="-6" x2="6"></line>
                          </g>
                          <g className="add-point" transform="translate(20,0)">
                              <rect x="-6" y="-6" width="12" height="12"></rect>
                              <line x1="-6" x2="6"></line><line y1="-6" y2="6"></line>
                          </g>
                      </g>
                  </g>
              </svg>

              <div className="sidebar">
                  <div className="header">D3 CURVE EXPLORER</div>
                  <div className="menu"></div>
                  <div className="info">
                      <span className="default">The JavaScript library <a href="https://d3js.org">D3</a> provides a number of <a href="https://github.com/d3/d3-shape#curves">curve types</a> to interpolate (or approximate) a set of points. Toggle each of the curve types using the buttons above. You can also add/remove/drag the points to change the shape of the curve.</span>
                      <span className="text"></span>
                  </div>
              </div>
          </div>
      )
  }
}
import React from 'react';
import { fabric } from 'fabric';
import './App.css';

class App extends React.Component {

  state = {
    canvas: null,
    isDown: false,
    drawingTool: 'rect',
    currentObject: '',
    x1: '',
    y1: '',
    x2: '',
    y2: '',
    img: ''
  }

  componentDidMount() {
    // initialze canvas
    const canvas = new fabric.Canvas(`canvas`, {
      selection: false,
      isDrawingMode: false,
    });
    this.setState({
      canvas: canvas
    }, () => {
      // get screen size 
      let whiteBoardWidth = document.getElementById("root").offsetWidth;
      let whiteBoardHeight = document.getElementById("root").offsetHeight - 100;
      // set canvas size
      canvas.setWidth(whiteBoardWidth);
      canvas.setHeight(whiteBoardHeight);
    })
  }

  addByPoint = () => {
    let { canvas, x1, y1, x2, y2, img } = this.state;
    if (x1 > 9 && y1 > 9 && x2 > 9 && y2 > 9 && img != '') {
      let left = x1;
      let top = y1;
      let width = 0;
      let height = 0;
      if (x1 > x2) {
        left = Math.abs(x2);
      }
      if (y1 > y2) {
        top = Math.abs(y2);
      }
      width = Math.abs(x1 - x2);
      height = Math.abs(y1 - y2);
      // add an image
      fabric.Image.fromURL(img, (myImg) => {
        let img = myImg.set({
          left: left,
          top: top,
          selectable: false,
          scaleX: width / myImg.width,
          scaleY: height / myImg.height,
        });
        canvas.add(img);
      });

      // show x1 cord on image
      let text1 = new fabric.IText(`x1:${x1.toString()}`, {
        left: x1,
        top: y1 - 10,
        selectable: false,
        fontFamily: 'Times New Roman',
        fontSize: 10,
      })
      canvas.add(text1);

      // show y1 cord on image
      let text2 = new fabric.IText(`y1:${y1.toString()}`, {
        left: (x1 + width) - 10,
        top: y1 - 10,
        selectable: false,
        fontFamily: 'Times New Roman',
        fontSize: 10,
      })
      canvas.add(text2);

      // show x2 cord on image
      let text3 = new fabric.IText(`x2:${x2.toString()}`, {
        left: x1,
        top: (y1 + height),
        selectable: false,
        fontFamily: 'Times New Roman',
        fontSize: 10,
      })
      canvas.add(text3);

      // show y2 cord on image
      let text4 = new fabric.IText(`y2:${y2.toString()}`, {
        left: x1 + width - 10,
        top: (y1 + height),
        selectable: false,
        fontFamily: 'Times New Roman',
        fontSize: 10,
      })
      canvas.add(text4);

      canvas.renderAll();
      this.setState({
        x1: '',
        y1: '',
        x2: '',
        y2: '',
        img: ''
      });
      document.getElementById("cordForm").reset();
      document.getElementById("fileInputId").value = null;
    }
  }

  setBackgroundImage(e) {
    // browse image set state
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = (f) => {
      let data = f.target.result;
      this.setState({
        img: data
      })
    };
    reader.readAsDataURL(file);
  }

  render() {
    let { x1, y1, x2, y2 } = this.state;
    return (
      <div className="container">
        <form id="cordForm">
          <label title="Add a background" className="">

            <input onChange={(e) => {
              e.preventDefault();
              this.setBackgroundImage(e);
            }} type="file" id="fileInputId" />
          </label>
          <br />
          <label>
            x1:{x1}, y1:{y1},  x2:{x2}, y2:{y2}
          </label>
          <br />
          x1:<input type="text" required min="10" onKeyUp={(e) => {
            this.setState({
              x1: Number(e.target.value)
            })
          }} />,
        y1:<input type="text" required min="10" onKeyUp={(e) => {
            this.setState({
              y1: Number(e.target.value)
            })
          }} />,
        x2:<input type="text" required min="10"
            onKeyUp={(e) => {
              this.setState({
                x2: Number(e.target.value)
              })
            }} />, y2:<input type="text" required min="10"
              onKeyUp={(e) => {
                this.setState({
                  y2: Number(e.target.value)
                })
              }} /> <button type="submit" onClick={(e) => {
                e.preventDefault();
                this.addByPoint();
              }}>Draw</button>
        </form>
        <canvas id={`canvas`} />
      </div>
    );
  }

}


export default App;

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
      this.renderCanvasEvents();
    });
  }


  renderCanvasEvents = () => {
    let origX = '';
    let origY = '';

    const { canvas } = this.state;
    canvas.on('mouse:down', (o) => {
      this.setState({
        isDown: true
      }, () => {

        // get mouse current position
        let pointer = canvas.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;
        // call shapes render function accoording to drawingTool
        let currentObject = this.drawRectangle(canvas, o.e, origX, origY);
        if (currentObject) {
          this.setState({
            currentObject: currentObject
          })
        }
      });
    });

    canvas.on('mouse:move', (o) => {
      if (!this.state.isDown)
        return;
      if (this.state.currentObject) {
        this.drawRectangle(canvas, o.e, origX, origY);
      }
    });
    canvas.on('mouse:up', (o) => {
      this.setState({
        isDown: false,
        currentObject: ''
      });
    });
  }

  drawRectangle = (canvas, event, origX, origY) => {
    let currentObject = ''
    let pointer = canvas.getPointer(event);
    if (this.state.currentObject) {


      console.log(event.target);


      var obj = this.state.currentObject;
      // if object is too big ignore
      if (obj.getScaledHeight() > obj.canvas.height || obj.getScaledWidth() > obj.canvas.width) {
        return;
      }
      obj.setCoords();
      // top-left  corner
      if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
        obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
        obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
      }
      // bot-right corner
      if (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height || obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width) {
        obj.top = Math.min(obj.top, obj.canvas.height - obj.getBoundingRect().height + obj.top - obj.getBoundingRect().top);
        obj.left = Math.min(obj.left, obj.canvas.width - obj.getBoundingRect().width + obj.left - obj.getBoundingRect().left);
      }


      // code for update selected Rectangle
      if (origX > pointer.x) {
        this.state.currentObject.set({
          left: Math.abs(pointer.x)
        });
      }
      if (origY > pointer.y) {
        this.state.currentObject.set({
          top: Math.abs(pointer.y)
        });
      }
      this.state.currentObject.set({
        width: Math.abs(origX - pointer.x)
      });
      this.state.currentObject.set({
        height: Math.abs(origY - pointer.y)
      });
      this.setState({
        x1: origX,
        y1: origY,
        x2: pointer.x,
        y2: pointer.y,
      })
      // code for update selected Rectangle
    } else {
      currentObject = new fabric.Rect({
        left: origX,
        top: origY,
        width: pointer.x - origX,
        height: pointer.y - origY,
        selectable: false,
        fill: 'transparent',
        stroke: 'red',
        strokeWidth: 5,
      });
      canvas.add(currentObject);
    }
    canvas.renderAll();
    return currentObject;
  }

  addByPoint = () => {
    let { canvas, x1, y1, x2, y2, } = this.state;
    if (x1 > 9 && y1 > 9 && x2 > 9 && y2 > 9) {
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

      let currentObject = new fabric.Rect({
        left: left,
        top: top,
        width: width,
        height: height,
        selectable: false,
        fill: 'transparent',
        stroke: 'red',
        strokeWidth: 5,
      });
      canvas.add(currentObject);


      // show x1 cord on image
      // let text1 = new fabric.IText(`x1:${x1.toString()}`, {
      //   left: x1,
      //   top: y1 - 10,
      //   selectable: false,
      //   fontFamily: 'Times New Roman',
      //   fontSize: 10,
      // })
      // canvas.add(text1);

      // show y1 cord on image
      // let text2 = new fabric.IText(`y1:${y1.toString()}`, {
      //   left: (x1 + width) - 10,
      //   top: y1 - 10,
      //   selectable: false,
      //   fontFamily: 'Times New Roman',
      //   fontSize: 10,
      // })
      // canvas.add(text2);

      // show x2 cord on image
      // let text3 = new fabric.IText(`x2:${x2.toString()}`, {
      //   left: x1,
      //   top: (y1 + height),
      //   selectable: false,
      //   fontFamily: 'Times New Roman',
      //   fontSize: 10,
      // })
      // canvas.add(text3);

      // show y2 cord on image
      // let text4 = new fabric.IText(`y2:${y2.toString()}`, {
      //   left: x1 + width - 10,
      //   top: (y1 + height),
      //   selectable: false,
      //   fontFamily: 'Times New Roman',
      //   fontSize: 10,
      // })
      // canvas.add(text4);

      canvas.renderAll();
      this.setState({
        x1: '',
        y1: '',
        x2: '',
        y2: '',

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

      fabric.Image.fromURL(data, (img) => {
        // add background image
        this.state.canvas.setBackgroundImage(img, this.state.canvas.renderAll.bind(this.state.canvas), {
          // scaleX: this.state.canvas.width / img.width,
          // scaleY: this.state.canvas.height / img.height
        });
        this.state.canvas.setWidth(img.width);
        this.state.canvas.setHeight(img.height);
      });

      this.setState({
        img: data
      });
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

import './Streamlit_mathlive.css'
import React from 'react'
import {Streamlit, StreamlitComponentBase, withStreamlitConnection } from "streamlit-component-lib"

class Streamlit_mathlive extends StreamlitComponentBase {
  
  constructor(props) {
    super(props)
    this.mf = React.createRef()
    this.state = {upright:this.props.args['upright'], value:this.props.args['value'],tex:this.props.args['value'], mathml:window.MathJax.tex2mml(this.props.args['value'],{em: 14, ex: 7, display: true})}
    if (this.props.args['edit']){
      Streamlit.setComponentValue([this.state.tex,this.state.mathml])
    }
    this.edit = this.props.args['edit']
    Streamlit.setFrameHeight()
  }

  componentDidMount(){
    if (this.props.args['edit']) {
      this.mf.current.smartFence = true
      this.mf.current.mathVirtualKeyboardPolicy = "sandboxed";
      window.mathVirtualKeyboard.visible = true;
      this.mf.current.addEventListener('input', (evt) => {
        if (evt.inputType === 'insertLineBreak') {
          evt.target.executeCommand('plonk')
        }
      })
      this.mf.current.focus()
    }
  }

  change_val = (evt) => {
    this.setState(
      { value: evt.target.value, tex: this.state.upright ? "\\mathrm{" + evt.target.value + "}" : evt.target.value  , mathml: window.MathJax.tex2mml(this.state.upright ? "\\mathrm{" + evt.target.value + "}" : evt.target.value,{em: 14, ex: 7, display: true})},
      () => Streamlit.setComponentValue([this.state.tex,this.state.mathml])
    )
    this.mf.current.value = this.state.value

    if(typeof window.MathJax !== "undefined"){
      window.MathJax.typesetClear()
      window.MathJax.typeset()
    }
  }
  
  handle_check = () => {
    this.setState(
      {upright:!this.state.upright})
    this.setState(
      {tex: this.state.upright ? "\\mathrm{" + this.state.value + "}": this.state.value , mathml: window.MathJax.tex2mml(this.state.upright ? "\\mathrm{" + this.state.value + "}" : this.state.value ,{em: 14, ex: 7, display: true})},
      () => Streamlit.setComponentValue([this.state.tex,this.state.mathml])
    )
  }
  
  render() {
    if (this.props.args['edit']) {
      return (
        <div className='App'>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <math-field 
              ref={this.mf} 
              onInput={(evt) => {
                this.change_val(evt)
              }}
              style={{
                '--ML__keyboard-toggle-visibility': 'hidden',
                '--ML__hamburger-menu-visibility': 'hidden'
              }}
            >
              {this.state.value}
            </math-field>
          </div>
          <break/>
        </div>
      )
    } else {
      return (<div></div>)
    }
  }
}

export default withStreamlitConnection(Streamlit_mathlive)
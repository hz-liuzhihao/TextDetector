import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Input, message } from 'antd';
import TextDecorator from '../../src/index';
import 'antd/dist/antd.css';

const Search = Input.Search;
TextDecorator.init(['麻痹', '操你妈', '操尼玛', '操蛋', '王八', '狗日']);

class App extends PureComponent {

  public decorator = (value: string) => {
    const result = TextDecorator.detector(value);
    if (result.length > 0) {
      message.error('文本有非法词汇');
    } else {
      message.success('文本内容合法');
    }
  }

  public render() {
    return <div>
      <p>检测词汇</p>
      <Search placeholder="请输入检测词汇" allowClear enterButton="检测" size="large" onSearch={this.decorator} />
    </div>;
  }
}

(function () {
  const root = document.getElementById('root');
  ReactDom.render(<App />, root);
})();

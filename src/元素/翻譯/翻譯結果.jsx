import React from "react";
import PropTypes from "prop-types";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import 漢字一逝臺羅一逝 from "../顯示/漢字一逝臺羅一逝";
import 顯示 from "../顯示/顯示";
import "./翻譯結果.css";
import 複製鈕 from "../複製鈕/複製鈕";

export const 計算複製內容 = (綜合標音 = []) =>
   綜合標音
  .map((item) => {
    const 漢字 = item.漢字.replace(/ /g, "");
    return {
      漢字臺羅: [漢字, item.臺羅閏號調].join("\n"),
      臺羅: item.臺羅閏號調,
      漢字,
    };
  })
  .reduce((acc, item) => ({
    漢字臺羅: [acc.漢字臺羅, item.漢字臺羅].join("\n"),
    漢字: [acc.漢字, item.漢字].join("\n"),
    臺羅: [acc.臺羅, item.臺羅].join("\n"),
  }));

class 翻譯結果 extends React.Component {
  點複製(內容) {
    const textField = document.createElement("textarea");
    textField.innerText = 內容;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  }

  取得複製內容() {
    const { 正在查詢, 查詢結果 } = this.props;
    const 發生錯誤 = 查詢結果.發生錯誤 || false;
    let 複製內容 = {};
    if (!正在查詢 && !發生錯誤) {
      複製內容 = 計算複製內容(查詢結果.綜合標音);
      複製內容.分詞 = 查詢結果.分詞;
    }
    return 複製內容;
  }

  render() {
    const { 腔口, 正在查詢, 查詢結果 } = this.props;
    const 發生錯誤 = 查詢結果.發生錯誤 || false;
    const 複製內容 = this.取得複製內容();

    const 複製鈕群 = [];
    for (const key in 複製內容) {
      複製鈕群.push(<複製鈕 copyOnClick={
          this.點複製.bind(this, 複製內容[key])
        } title={key}/>);
    }

    return (
        <div>
          {
            (正在查詢 &&
              <h1 className='ui header'>載入中……</h1>
            )
          }
          {
            (發生錯誤 &&
              <h1 className='ui red header'>主機發生錯誤</h1>
            )
          }
          <div style={{ opacity: 正在查詢 ? 0.3 : 1 }}>
            <div className="ui stackable four large teal buttons">
            {複製鈕群}
            </div>
            <漢字一逝臺羅一逝
                    腔口={腔口}
                    查詢結果={查詢結果}/>
          </div>
        </div>
    );
  }
}

翻譯結果.propTypes = {
  正在查詢: PropTypes.bool.isRequired,
  查詢結果: PropTypes.shape({

    綜合標音: PropTypes.array.isRequired,
  }).isRequired,
  腔口: PropTypes.string.isRequired,
};

export default 翻譯結果;

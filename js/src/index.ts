export default class TextDecorator {

  static keywordMap: JSONObject;

  /**
   * 检测词汇url地址
   * @param url 
   */
  static init(url: string | string[]) {
    if (!url) {
      return;
    }
    TextDecorator.keywordMap = null;
    if (url instanceof Array) {
      TextDecorator.onload(url);
    } else {
      const script = document.createElement('script');
      script.src = url;
      script.onload = function () {
        const texts = JSON.parse(window.lzhtextdecorator);
        TextDecorator.onload(texts);
      }
    }
  }

  /**
   * 装载词汇树
   * @param texts 
   */
  static onload(texts: string[]) {
    if (TextDecorator.keywordMap != null) {
      return;
    }
    // 遍历词汇文本
    texts.forEach(text => {
      if (text) {
        const strs = text.split('');
        // 标记当前元素的文本map
        if (!TextDecorator.keywordMap) {
          TextDecorator.keywordMap = {};
        }
        let parentMap = TextDecorator.keywordMap;
        // 对每个文本进行拆分
        strs.forEach((item) => {
          // 当父文本为空时,说明上次是在这里结束的,所以要标记文本可能在这里就已经是检测词汇了
          if (!parentMap) {
            parentMap = {
              isEnd: true
            };
          }
          if (parentMap[item]) {
            parentMap = parentMap[item];
          } else {
            parentMap[item] = null;
          }
        });
        // 当遍历完词汇后,如果父文本不为空说明下面还有检测词汇,当前词汇应该标记为可结束文本
        if (!parentMap) {
          parentMap.isEnd = true;
        }
      }
    });
  }

  /**
   * 检测文本
   * @param text 文本
   * @param isGlobal 是否进行全局检测,如果是false则检测到一处就返回,否则返回检测列表的索引位置
   */
  static detector(text: string, isGlobal: boolean = false) {
    if (!text) {
      return null;
    }
    const texts = text.split('');
    const keywordMap = TextDecorator.keywordMap;
    let parentMap = keywordMap;
    // 初始开始位置
    let startIndex = 0;
    let results: DecoratorResult[] = [];
    for (let i = 0; i < texts.length; i++) {
      const item = texts[i];
      // 当检测到相关词时需要让keywordMap移动到下一个词汇列表继续检测
      if (parentMap[item] !== undefined) {
        // 当检测到当前的map为null或者内容中标记结束,则词汇段检测到一个关键词
        if (parentMap[item] == null || parentMap[item].isEnd) {
          results.push({
            start: startIndex,
            end: i + 1
          });
          if (!isGlobal) {
            return {
              start: startIndex,
              end: i + 1
            };
          }
          parentMap = TextDecorator.keywordMap;
          startIndex = i + 1;
        } else {
          parentMap = parentMap[item];
        }
      } else {
        // 没有检测到时说明当前关键字不再上一个检测词汇中继续向下走
        parentMap = TextDecorator.keywordMap;
        if (parentMap[item] !== undefined) {
          startIndex = i;
          parentMap = parentMap[item];
        }
      }
    }
    return results;
  }
}
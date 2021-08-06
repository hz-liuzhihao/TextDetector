import { BorderPosition } from './enum';
/**
 * 防抖处理
 * @param time 
 * @param callback 
 */
export function throttle(time: number, callback: Function) {
  let prevTime = 0;
  return function (this: any, ...params: any[]) {
    const currentTime = +new Date();
    if (currentTime - prevTime > time) {
      callback && callback(...params);
      prevTime = currentTime;
    }
  }
}

/**
 * 创建dom
 * @param type 
 */
export function createElement<T>(type: keyof HTMLElementTagNameMap): T {
  return document.createElement(type) as any as T;
}

/**
 * 创建svgdom
 * @param type 
 */
export function createElementNS(type: keyof SVGElementTagNameMap) {
  return document.createElementNS('http://www.w3.org/2000/svg', type);
}

/**
 * 查找具有某种属性的dom,纵向向上查找
 * @param dom 
 * @param attr 
 * @param limitDom 停止查找的dom元素,一般是事件监听者
 */
export function findDomByAttr(dom: HTMLElement, attr: string, limitDom: HTMLElement): HTMLElement {
  if (!dom || dom.tagName === 'BODY' || dom === limitDom) {
    return null;
  }
  if (dom.hasAttribute(attr)) {
    return dom;
  }
  return findDomByAttr(dom.parentElement, attr, limitDom);
}

/**
 * 查找具有某种样式类名的dom,纵向向上查找
 * @param dom 
 * @param className 
 * @param limitDom 停止查找的dom元素,一般是事件监听者
 */
export function findDomByClass(dom: HTMLElement, className: string, limitDom: HTMLElement) {
  if (!dom || dom.tagName === 'BODY' || dom === limitDom) {
    return null;
  }
  if (dom.classList.contains(className)) {
    return dom;
  }
  return findDomByAttr(dom.parentElement, className, limitDom);
}

/**
 * 设置dom样式
 * @param dom 
 * @param attr 
 * @param value 
 * @param unit 单位
 */
export function setDomStyle(dom: Element, attr: keyof CSSStyleDeclaration, value: any, unit?: string) {
  if (typeof value === 'number') {
    switch (attr) {
      case 'width':
      case 'height':
      case 'left':
      case 'right':
      case 'top':
      case 'bottom':
        value = `${value}${unit || 'px'}`;
        break;
      default:
        break;
    }
  }
  const style = (dom as any).style;
  if (style[attr] != value) {
    style[attr] = value;
  }
}

/**
 * 设置dom属性
 * @param dom 
 * @param attr 
 * @param value 
 */
export function setDomAttr<T>(dom: Element, attr: keyof T, value: any) {
  if ((dom as any)[attr] != value) {
    (dom as any)[attr] = value;
  }
}

/**
 * 重复构造某个函数返回值
 * @param func 
 * @param count 
 */
export function repeatFill<T>(func: () => T, count: number): T[] {
  const result: T[] = [];
  const arr = new Array(count).fill(undefined);
  arr.forEach(() => {
    result.push(func());
  });
  return result;
}

/**
 * 根据dom找到组件
 * @param dom 
 * @param group 
 */
export function findCompByDom<T>(dom: HTMLElement, group?: string): T {
  if (!dom || dom.tagName === 'BODY') {
    return null;
  }
  const comp = dom.__comp__;
  if (comp && group) {
    if (comp.getGroup && typeof comp.getGroup === 'function') {
      if (comp.getGroup() === group) {
        return comp;
      }
    }
  } else if (comp) {
    return comp;
  }
  return findCompByDom(dom.parentElement, group);
}

/**
 * 获取鼠标所在方位
 * @param dom 
 * @param event 
 */
export function getPositionByEvent(dom: HTMLElement, event: MouseEvent): BorderPosition {
  const rect = dom.getBoundingClientRect();
  const mouseX = event.clientX - rect.x;
  const mouseY = event.clientY - rect.y;
  const width = rect.width;
  const height = rect.height;
  const halfW = width / 2;
  const halfH = height / 2;
  if (mouseX < halfW - 5) {
    if (mouseY < halfH - 5) {
      return BorderPosition.LT;
    } else if (mouseY > halfH + 5) {
      return BorderPosition.LB;
    } else {
      return BorderPosition.L;
    }
  } else if (mouseX > halfW + 5) {
    if (mouseY < halfH - 5) {
      return BorderPosition.RT;
    } else if (mouseY > halfH + 5) {
      return BorderPosition.RB;
    } else {
      return BorderPosition.R;
    }
  } else {
    if (mouseY < halfH - 5) {
      return BorderPosition.T;
    } else if (mouseY > halfH + 5) {
      return BorderPosition.B;
    } else {
      return BorderPosition.C;
    }
  }
}

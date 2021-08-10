declare module '*.png' {
    const value: string
    export = value
}

declare module '*.mp4' {
    const content: string
    export = content
}

declare module '*.css' {
    const content: string;
    export default content;
}

declare module '*.less' {
    const content: JSONObject;
    export default content;
}

interface JSONObject {
    [key: string]: any;
}

interface Window {
    lzhtextdecorator: string | string[];
}

interface DecoratorResult {
    start: number;
    end: number;
}
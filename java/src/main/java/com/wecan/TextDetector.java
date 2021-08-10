package com.wecan;

import com.alibaba.fastjson.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;

public class TextDetector {

    private static JSONObject keywordMap;

    /**
     * 初始化关键词结构
     *
     * @param url
     */
    public static void init(Object url) {
        if (url == null) {
            return;
        }
        if (!(url instanceof String) || !(url instanceof ArrayList)) {
            return;
        }
        keywordMap = null;
        if (url instanceof String[]) {
            onload((ArrayList<String>) url);
        } else {
            StringBuffer content = new StringBuffer();
            InputStreamReader reader = null;
            BufferedReader breader = null;
            try {
                URL neturl = new URL((String) url);
                URLConnection connection = neturl.openConnection();
                connection.setAllowUserInteraction(false);
                reader = new InputStreamReader(neturl.openStream());
                breader = new BufferedReader(reader);
                String data;
                while ((data = breader.readLine()) != null) {
                    content.append(data);
                }
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                try {
                    reader.close();
                    breader.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            ArrayList<String> texts = (ArrayList<String>) JSONObject.parseArray(breader.toString(), String.class);
            onload(texts);
        }
    }

    /**
     * 检测文本
     * @param text
     * @param isGlobal
     * @return
     */
    public static boolean detector(String text, boolean isGlobal) {
        if (text == null || keywordMap == null) {
            return false;
        }
        String[] texts = text.replaceAll("\\s+", text).split("");
        JSONObject parentMap = keywordMap;
        for (int i = 0; i < texts.length; i++) {
            String item = texts[i];
            // 当检测到相关词时需要让keywordMap移动到下一个词汇列表继续检测
            if (parentMap.get(item) != null) {
                if (parentMap.get(item) instanceof Integer || (boolean) ((JSONObject) parentMap.get(item)).get("isEnd")) {
                    return true;
                } else {
                    parentMap = (JSONObject) parentMap.get(item);
                }
            } else {
                parentMap = keywordMap;
                if (parentMap.get(item) != null) {
                    parentMap = (JSONObject) parentMap.get(item);
                }
            }
        }
        return false;
    }

    /**
     * 装载关键词
     *
     * @param texts
     */
    private static void onload(ArrayList<String> texts) {
        if (keywordMap != null) {
            return;
        }
        // 遍历词汇文本
        texts.forEach(text -> {
            if (text != null) {
                String[] strs = text.split("");
                // 标记当前元素的文本map
                if (keywordMap == null) {
                    keywordMap = new JSONObject();
                }
                JSONObject parentMap = keywordMap;
                for (int i = 0; i < strs.length; i++) {
                    String item = strs[i];
                    if (parentMap.get(item) != null && !(parentMap.get(item) instanceof Integer)) {
                        // 当遍历完词汇后,如果文本不为空说明下面还有检测词汇,当前词汇应该标记为可结束文本
                        if (strs.length - 1 == i && parentMap.get(item) instanceof JSONObject) {
                            ((JSONObject) parentMap.get(item)).put("isEnd", true);
                        }
                        parentMap = (JSONObject) parentMap.get(item);
                    } else {
                        if (i < strs.length - 1) {
                            // 如果父文本早就存在这个词汇根则需要标记为上次已结束的
                            if (parentMap.get(item) instanceof Integer) {
                                JSONObject json = new JSONObject();
                                json.put("isEnd", true);
                                parentMap.put(item, json);
                                parentMap = json;
                            } else {
                                JSONObject json = new JSONObject();
                                parentMap.put(item, json);
                                parentMap = json;
                            }
                        } else {
                            parentMap.put(item, 1);
                        }
                    }
                }
            }
        });
    }
}

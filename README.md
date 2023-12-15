---



<div align="center">
    <img width="1080" src="res/logo.png" alt=logo">
</div>
   


---
<p>什么，禁止登录？崽崽寄了！那怎么办，要不…跑路吧？</p>

## 功能介绍

适用于[云崽](https://gitee.com/Le-niao/Yunzai-Bot)/[喵崽](https://gitee.com/yoimiya-kokomi/Miao-Yunzai)的JavaScript插件
<br>
——调用[LoliconAPI](https://api.lolicon.app/#/)接口获取萝莉涩图（其实就是个简单的请求和响应）
<br>
——还有，**我<s>不</s>是萝莉控ovo**
<br>
**注意！V2版极大概率会因为风控导致发不出图，并非本插件问题！**
<br>
**如无法使用V2版正常获取图片请使用V3版（记得安装依赖）**
<br>
**出现任何报错可以向我反馈（但是带上截图），解决一切报错（<s>直接抛出</s>**

## 命令列表
<details>

- **来份涩图**：返回随机(萝莉)图片
- **来3份涩图**：返回多张随机(萝莉)图片
- **来份碧蓝档案涩图**：返回指定tag图片（可使用“|”分隔tag，最多三个
- **来3份碧蓝档案涩图**：返回多张指定tag图片（可使用“|”分隔tag，最多三个
- **配置**：config里所有参数皆可修改，暂不考虑单独提取为yaml（已实现但未上传，有需要可以联系我，只是懒得维护

</details>

## V3安装：

###使用github源

在云崽根目录下运行


```
curl -o ./plugins/example/LoliconAPI[V3].js https://raw.githubusercontent.com/SakuraTairitsu/LoliconAPI/main/LoliconAPI%5BV3%5D.js
pnpm install sharp@latest -w
```

###使用gitee源（推荐）

在云崽根目录下运行

```
curl -o ./plugins/example/LoliconAPI[V3].js https://gitee.com/SakuraTairitsu/LoliconAPI/raw/main/LoliconAPI%5BV3%5D.js
pnpm install sharp@latest -w
```

###手动安装
Download或者Copy本目录下的LoliconAPI.js放入plugins/example即可

<details>
 <summary>椰奶插件</summary> 

- 官网：[Yenai-plugin](https://www.yenai.ren/)
- Gitee：[Yenai-plugin](https://gitee.com/yeyang52/yenai-plugin)&nbsp;&nbsp;(作者：[@椰羊](https://gitee.com/yeyang52))
- Github：[Yenai-plugin](https://github.com/yeyang52/yenai-plugin)&nbsp;&nbsp;(作者：[@椰羊](https://github.com/yeyang52))

</details>

<details>
 <summary>Miao-Yunzai&nbsp;&nbsp;传送门</summary> 

- Gitee：[Miao-Yunzai](https://gitee.com/yoimiya-kokomi/Miao-Yunzai)&nbsp;&nbsp;(作者：[@喵喵](https://gitee.com/yoimiya-kokomi))
- Github：[Miao-Yunzai](https://github.com/yoimiya-kokomi/Miao-Yunzai)&nbsp;&nbsp;(作者：[@喵喵](https://github.com/yoimiya-kokomi))

</details>

<details>
 <summary>Yunzai-Bot-lite&nbsp;&nbsp;传送门</summary>（挺好的，我自用的就是这个，不过需要自行维护和修改…）

- Gitee：[Yunzai-Bot-lite](https://gitee.com/Nwflower/yunzai-bot-lite)&nbsp;&nbsp;(作者：[@听语惊花](https://gitee.com/Nwflower))
- Github：[Yunzai-Bot-lite](https://github.com/Nwflower/yunzai-bot-lite)&nbsp;&nbsp;(作者：[@听语惊花](https://github.com/Nwflower))

</details>

<details>
 <summary>Yunzai-Bot&nbsp;&nbsp;传送门</summary> 

- Gitee：[Yunzai-Bot](https://gitee.com/Le-niao/Yunzai-Bot)&nbsp;&nbsp;(作者：[@Le-niao](https://gitee.com/Le-niao))

</details>

## 特别鸣谢
感谢[Yenai-plugin](https://www.yenai.ren/)插件作者[@椰羊](https://gitee.com/yeyang52)的字典源码（正则写的真是头疼
<div><img width="1080" src="res/face.jpg" alt="face"><div>

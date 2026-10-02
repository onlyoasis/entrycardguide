---
title: "MCP：登录并授权你的 Agent"
description: "通过 MCP 获取官方入境表指南和全球目的地资料。验证邮箱并登录后，单独授权可撤销的只读凭据。"
date: 2026-09-26
lastmod: 2026-10-02
url: "/zh/mcp/"
---

## 注册、登录与授权

[打开账户页面](/api/mcp/account?lang=zh)。使用自己的邮箱注册，输入收到的一次性验证码完成邮箱验证和登录。再次登录时重新申请验证码；验证码10分钟内有效。

注册和登录不会直接开通 MCP。登录后在账户页明确授权**只读 MCP 访问**，才会生成 API key。凭据只显示一次，请保存到客户端的安全存储中。凭据30天后过期，也可随时在账户页撤销。同一账户下所有凭据共用调用额度。

## 可用工具

| 工具 | 返回内容 |
|---|---|
| `list_countries` | 全部249个目的地、核实状态、资料库链接与已有指南 |
| `get_jurisdiction` | 一个目的地可公开的有来源申报事项、原核实日期、来源与覆盖情况 |
| `get_country_forms` | 53个详细表单指南中的一个国家的官方链接与费用 |
| `get_field_rules` | 字段规则或准备资料说明，明确其校验模式 |
| `get_field_guide` | 英文、简体或繁体的字段示例及填写说明 |
| `run_decision_tree` | 已支持指南的决策问题、费用和填报说明 |

[全球资料库](/zh/library/)区分已核实、部分核实和受阻记录。没有公开某个事项，表示该事项未通过公开核验，不能理解为无需申报。返回日期是来源核实日期，不代表调用时重新核实了法规。

## 接入客户端

配置支持 Streamable HTTP 的 MCP 客户端：

```json
{
  "mcpServers": {
    "entrycardguide": {
      "type": "http",
      "url": "https://entrycardguide.com/api/mcp",
      "headers": {
        "Authorization": "Bearer ecg_YOUR_AUTHORIZED_KEY"
      }
    }
  }
}
```

直接调用 HTTP 时还需发送 `Content-Type: application/json`、`Accept: application/json, text/event-stream` 和协商后的 `MCP-Protocol-Version`。登录 Cookie 不能授权 MCP 请求。缺少有效只读授权的请求返回 `401`。

## 校验与调用额度

每次请求检查身份、授权范围、到期状态、传输请求头、JSON-RPC 结构、方法参数和工具参数。无效国家编号、语言、额外字段及无效决策路径均被拒绝。输入错误不扣调用次数。

免费账户每个UTC自然月可成功调用工具**100次**。`initialize`、`tools/list`、`ping`不计数。并发调用通过同一原子额度检查，额度用尽返回`429`。

```bash
curl https://entrycardguide.com/api/mcp/whoami \
  -H 'Authorization: Bearer ecg_YOUR_AUTHORIZED_KEY'
```

## 数据使用

来源网址和已有指南数据继续使用[CC BY-SA 4.0](https://github.com/onlyoasis/entrycardguide/blob/main/LICENSE-CC-BY-SA-4.0)。转载须注明entrycardguide.com。商业授权请联系`licensing@entrycardguide.com`。服务不发布点名中介名单或内部研究文件。

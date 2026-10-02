# 2026-10-02 生产发布执行

用户已明确授权本次提交、合并、推送与部署。目标为现有entrycardguide Cloudflare Pages，生产分支main。

## 执行范围与前置条件

- 整合工作树`/Volumes/ExternalPrivate/Workspaces/codex/entrycardguide-release-global-mcp`；canonical原未提交工作保留。
- 249目的地三语公共库、53详细指南、邮箱验证码MCP登录与授权；沿用本地报告的328公开/66暂不公开/531待核范围。
- 本机Wrangler4.85未认证；GitHub仓库已有Cloudflare生产API token及account id的加密secret。采用CI在原受控环境使用现有凭据，不将令牌下载到本地。
- 仅初始化专用`entrycardguide-mcp` D1、应用两份迁移、创建或保留MCP_AUTH_SECRET。CI只输出resource ID与secret名称，不输出秘密值。邮件配置须来自本项目明确授权的凭据。
- 已向用户询问邮件凭据位置、发件邮箱和上线收码验收邮箱。没有借用其他项目邮件密钥。

## 发布链修复

维护workflow已切public-release，URL数据变更后先本地提交源日期，再生成繁体与MCP、通过门禁后一次推送；两个deploy workflow固定Wrangler4.85。Growth/索引/SEO负例更新到新目录，索引含三语。生产部署后回读Cloudflare canonical部署revision和正式域名目录/站点地图/MCP拒绝边界，并保存不含凭据的artifact。

本轮后续验证：发布链静态验证、8项实际SEO负例通过；正式提交后须重新生成繁体日期并复验，再推送。

## 执行记录

当前为生产初始化及提交准备阶段。commit、merge、push、数据库、配置、部署及线上结果按实际发生分别追加，未执行的不算完成。

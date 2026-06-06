T03 已完成，未执行 T04 或后续任务。

实现内容：
- 新增 Prisma 7 schema、config、seed、migration。
- 新增 Web Prisma repository helpers。
- 新增 `test:db` readback 测试，覆盖 10 个 P0 model。
- 本地验证 DB 使用 SQLite，明确记录为非生产替代；PostgreSQL 仍是产品目标。
- 写入 DB readback JSON、result JSON、HANDOFF 和 command log。

关键证据：
- `docs/auto-execute/results/web/T03.json`
- `docs/auto-execute/latest/web/T03-HANDOFF.md`
- `docs/auto-execute/evidence/web/T03/db-readback.json`
- `docs/auto-execute/logs/web/T03-command-log.md`

验证已通过：
- `prisma generate`
- `prisma db push`
- `prisma db seed`
- `prisma migrate dev --name init --create-only`
- `test:db`
- `typecheck`
- `lint`
- `git diff --check`
- JSON parse check

最终 readback counts：10 个 P0 model 均有数据，`AnalyticsEvent` 3 条，`CardTemplate` 3 条；draw/generate/save/seal 幂等键均被测试验证。
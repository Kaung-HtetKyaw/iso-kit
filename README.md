# ISO-KIT

The goal of this project is to provide a strong and efficient starter to quickly start developments on new projects. We welcome all feedback and
contributions.

To access the documentation you must have [docsify] installed on your system.

```bash
# use npm
npm i docsify-cli -g
# or yarn
yarn global add docsify-cli
```

then simply run

```bash
# you may replace the port by another of your choosing
# if not defined it will use the port 3000
# which may get it conflict with the application itself
docsify serve docs -p 4000
```

[docsify]: https://docsify.js.org
[apv]: https://www.appvantage.co

## Features

List of features embedded with this SK

| Features                                          | DevOps                               | CI/CD                                             |
| ------------------------------------------------- | ------------------------------------ | ------------------------------------------------- |
| GraphQL API on Apollo (with subscription support) | Helm Chart                           | Automated semantic releasing                      |
| TypeScript on FE & BE                             | Docker build                         | Sentry releasing                                  |
| Code Generation based on GraphQL schema           | Docker Compose for local development | Unit testing (jest, code coverage)                |
| Server Side Rendering support                     | Prometheus Metrics                   | Functional testing (Cypress with video recording) |
| Fully configurable over environment variables     | Guidelines for k8s setup             | Typescript checks                                 |
| Sentry implementation & tracking                  | CDN support for static assets        | ESlint/Prettier checks                            |
| Asynchronous worker & scheduler (bull)            |                                      | Commit messages checks                            |
| Hot reload on the whole stack                     |                                      | Build check (reporting on bundle)                 |
| Cache server (redis)                              |                                      | Docker build & push                               |
| Rate limiter                                      |                                      | Automated deployment with helm                    |
| Security headers for HTTP requests                |                                      |                                                   |
| Database (mongodb) with migration framework       |                                      |                                                   |
| Emails rendering (react with mjml)                |                                      |                                                   |
| PDF rendering (react with remote printer)         |                                      |                                                   |
| DataLoader for GraphQL resolvers                  |                                      |                                                   |
| Object Storage support                            |                                      |                                                   |
| I18n module (with i18next)                        |                                      |                                                   |

Security practices have been applied on this project based on experiences and feedbacks.
However, this is only a starter-kit as an helper to boostrap your project.
We do not hold responsibilities nor guarantee the security of your application.

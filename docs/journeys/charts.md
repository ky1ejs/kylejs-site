# Github Contribution Analysis 

## Intro
With [this GitHub issue](https://github.com/ky1ejs/kylejs-site/issues/379), I wanted to add analysis of my GitHub contributions to this site. This involves fetching data from the GitHub API and displaying in an engaging and visual way.

## Data to show
### Contributions
* Filter by total, last 5 years and last year
* For each time period, show:
  * Total contributions
  * Contributions by type (commits, issues, pull requests)
  * Contributions by repository
  * Line chart of contributions over time
  * Languages typically used in contributions
  * Most common repositories contributed to
  * Longest streak of contributions and when it was in the current year
  * Most popular repositories contributed to in the year

### The present
* Contributions in the current year
* Current streak of contributions
* Longest streak of contributions in the current year
* Last 5 repositories contributed to

### My repositories
* List of my repositories
* Spread of languages used in my repositories
* Stars and forks for each repository
* Top 5 repositories by stars
* Popular archived repositories
* Repositories by category

## Chart Lbrary Selection

### Intro
With [this GH issue](https://github.com/ky1ejs/kylejs-site/issues/379) for adding analysis of my GitHub contributions to this site, a chart library is needed.

### Options

#### Claude Code initially chose [Recharts](https://recharts.org/)
Initially, Claude Code, which I assigned the GH issue to, went with [recharts](https://recharts.org/), but I didn't like the style or that it was hard to make pie chart segments clickable (or at least I couldn't find a way to do it).

#### What the internet suggests
[This post on r/reactjs](https://www.reddit.com/r/reactjs/comments/1ddbqei/open_source_react_chart_libraries/) suggests a bunch of options:
  * [Victory](https://formidable.com/open-source/victory/)
  * [Chart.js](https://www.chartjs.org/)
  * [Nivo](https://nivo.rocks/)
  * [BizCharts](https://bizcharts.net/)
  * [Visx](https://airbnb.io/visx/)
  * [React-Vis](https://uber.github.io/react-vis/)
  * [Chartist](https://gionkunz.github.io/chartist-js/)
  * [Plottable.js](http://plottablejs.org/)
  * [React Chartkick](https://github.com/ankane/react-chartkick)
  * [ECharts for React](https://github.com/hustcc/echarts-for-react)
  * [Tremor](https://tremor.so/)
  * [MUI X Charts](https://mui.com/x/react-charts/)
  * [AG Charts](https://github.com/ag-grid/ag-charts)

#### Trying out Tremor
I tried out [Tremor](https://tremor.so/) but it didn't have but also had issues trying to make pie chart segments selectable.

It also requires that you add a lot of JS and CSS to your project by hand ([example](https://tremor.so/docs/utilities/cx)), which I didn't like. I prefer to use a package manager to manage dependencies.

#### My choice: AG Charts
I've used [AG Grid](https://www.ag-grid.com/) before, and I appreciate its flexibility and performance. [AG Charts](https://www.ag-grid.com/ag-charts/) comes from the same team and I was able to get selectable pie chart segments working with it pretty quickly.

### Alternatives
In the future, I'd perhaps consider having a go at writing my own chart implementation to learn about what it takes. For now I have other things I want to focus on.

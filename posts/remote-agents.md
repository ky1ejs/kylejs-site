---
title: Remote Agents
description: Exploring the concept of Remote Agents in AI development
date: 2025-07-05
published: true
shareImage: /_next/image?url=%2Fposts%2Fimages%2Fremote-agents.jpg&w=3840&q=75
---

<Image src="/posts/images/remote-agents.jpg" className="rounded-lg" />

# Intro
This weekend I used [GitHub Copilot's "coding agents"](https://docs.github.com/en/copilot/concepts/about-copilot-coding-agent), by which they mean agents that run on github.com, not the "agent mode" in VS Code. 

Cursor and Claude also have offerings for these types of agents, calling them both "Background" agents.

I prefer to call them "Remote Agents" since that makes it clearer that they're not running on your machine. Background and Coding Agents could be interpreted as something you run  on your local machine with Claude Code in the terminal or in the Cursor IDE.

I've found remote agents to be an awesome concept for a few reasons:
1. **anywhere, anytime** – prompt and go. Start on mac, check in on iPhone. Or prompt when you have an idea on your iPhone while you're on the go and then open your mac when you get home to see what it did
2. **isolated & safe** –  because the agent is off running in some container, it can go ham on a branch of its own and not break my machine, and it can run tools without me approving each of them basically zero risk. 

For more on getting to know Remote Agents I recommend [this section of a @wesbos YouTube video](https://www.youtube.com/watch?v=r9b8Q4G6_tc&t=193s) where he talks about their introduction and utility.

# Who offers Remote Agents?
GitHub Copilot, Cursor and Claude Code all offer Remote Agents, but only Copilot offers them within their subscription. 

## GitHub Copilot Coding Agents
[GitHub "Coding Agents"](https://docs.github.com/en/copilot/concepts/about-copilot-coding-agent) use [GitHub's "premium requests"](https://docs.github.com/en/billing/managing-billing-for-your-products/about-billing-for-github-copilot#allowance-usage-for-copilot-coding-agent). Each subscription tier of GitHub have allowances for premium requests and you can optionally enable pay-per-request after your allowance is used up. 

Here's an [example PR that GitHub Copilot Agents made](https://github.com/ky1ejs/linea-micra-controller/pull/8) to a ESP32 repo of mine that implemented automatic wi-fi / websocket reconnection. It made 48 premium requests in the process of doing this. At the time, I'd already used up my allowance on the Pro tier, so this translated into a cost of $2 (which feels pretty steep tbh...).

Here's the allowance of each tier:
* **Free**: 50 premium requests
* **Pro**: 300 premium requests
* **Pro+**: 1500 premium requests

If I paid for the Pro+ tier, GitHub Coding Agent could make me roughly 31 of the PR I linked to above per month for $39. This would use up all 1500 of my monthly requests, though, leaving me with none for other features that require them such as Copilot Chat, Agent mode in Copilot Chat, Copilot Code review, Copilot Extensions and Copilot Spaces (read more [here](https://docs.github.com/en/copilot/concepts/copilot-billing/understanding-and-managing-requests-in-copilot#premium-features)).

## Cursor Background Agents
[Cursor introduced background agents in mid-May 2025](https://forum.cursor.com/t/cursor-0-50-new-tab-model-background-agent-refreshed-inline-edit/92348) but sadly their usage is not included in any of their plans.

Cursor plans merely give you "access" to Background Agents, but they're [charged at "API pricing"](https://docs.cursor.com/account/pricing#background-agent) (i.e usage-based pricing). Like GitHub, I expect this to be pretty steep and could easily get out of hand. I prefer to pay a flat rate than per API request.

## Claude Code GitHub Actions
A mere 7 days after Cursor announced their Background Agents, [Anthropic added "Background Agents"](https://www.anthropic.com/news/claude-4) via an [official GitHub Action](https://github.com/anthropics/claude-code-action). 

Again, like Cursor, Claude Code does not included usage of this GitHub Action through any of its subscriptions. The action uses its developer API, for which you have to buy credits... *booooo* usage-based pricing.

**HOWEVER!** Some clever people ([see this GitHub issue on the official GH action repo](https://github.com/anthropics/claude-code-action/issues/4#issuecomment-3017209262) where folks are asking for access to it via their plans instead of via dev credits) have got together and [forked the official Claude GitHub Action to work with the Claude Max Subscription](https://github.com/grll/claude-code-action)!

This fork states compatibility with the Max plan, but I tried it out anyway with my Claude Pro plan. Sadly this resulted in [an error about an invalid model name being passed to Claude](https://github.com/ky1ejs/linea-micra-controller/actions/runs/16093096365/job/45412273610). 

When I started to dig deeper into whether this error was indeed caused by me not having a Max plan, I noticed [this comment in an issue on the GH action fork](https://github.com/grll/claude-code-action/issues/2#issuecomment-3036068547) where the author shared that Anthropic will soon announce that their Pro and Max plan will work with this Remote Agent GH Action 🎉

# Wrap-up
Remote Agents are something I'm really excited about for parallelizing work without it being bound to my machine. 

That said, it's obviously not going to be a replacement for local agent usage for when you want more granular control over the iteration or to support other workflows such as [sub-agents](https://www.youtube.com/watch?v=9ipM_vDwflI). 

I'll personally be waiting for Anthropic to add Remote Agent functionality to their subscriptions and will be happy to upgrade from the Pro to the Max plan to get it. 
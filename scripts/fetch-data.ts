/**
 * Run with: npm run fetch-data
 * Fetches GitHub repos, Medium posts, and LeetCode stats
 * and saves them to data/profile.json
 */

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import RSSParser from 'rss-parser';

const PROFILE_PATH = path.join(process.cwd(), 'data', 'profile.json');

const profile = JSON.parse(fs.readFileSync(PROFILE_PATH, 'utf-8'));

const parser = new RSSParser();

async function fetchGitHubData() {
  console.log('📦 Fetching GitHub data...');
  try {
    const reposRes = await axios.get(
      `https://api.github.com/users/${profile.github_username}/repos?sort=updated&per_page=20`
    );

    const repos = reposRes.data
      .filter((r: any) => !r.fork)
      .map((r: any) => ({
        name: r.name,
        description: r.description || '',
        url: r.html_url,
        stars: r.stargazers_count,
        language: r.language || '',
        topics: r.topics || [],
        updated_at: r.updated_at,
      }));

    profile.github_repos = repos;
    console.log(`  ✓ Fetched ${repos.length} repos`);
  } catch (err) {
    console.error('  ✗ GitHub fetch failed:', (err as Error).message);
  }
}

async function fetchMediumPosts() {
  console.log('📝 Fetching Medium posts...');
  try {
    const feed = await parser.parseURL(
      `https://medium.com/feed/@${profile.medium_username || 'indhuinapakolla'}`
    );

    const posts = (feed.items || []).slice(0, 10).map((item: any) => ({
      title: item.title || '',
      link: item.link || '',
      summary: item.contentSnippet?.slice(0, 300) || '',
      published: item.pubDate || '',
      categories: item.categories || [],
    }));

    profile.medium_posts = posts;
    console.log(`  ✓ Fetched ${posts.length} Medium posts`);
  } catch (err) {
    console.error('  ✗ Medium fetch failed:', (err as Error).message);
  }
}

async function fetchLeetCodeStats() {
  console.log('💻 Fetching LeetCode stats...');
  try {
    const query = {
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `,
      variables: { username: profile.leetcode_username },
    };

    const res = await axios.post('https://leetcode.com/graphql', query, {
      headers: { 'Content-Type': 'application/json' },
    });

    const stats = res.data?.data?.matchedUser?.submitStats?.acSubmissionNum || [];
    const easy = stats.find((s: any) => s.difficulty === 'Easy')?.count || 0;
    const medium = stats.find((s: any) => s.difficulty === 'Medium')?.count || 0;
    const hard = stats.find((s: any) => s.difficulty === 'Hard')?.count || 0;

    profile.leetcode_stats = {
      total_solved: easy + medium + hard,
      easy,
      medium,
      hard,
    };

    console.log(`  ✓ LeetCode: ${easy + medium + hard} problems solved`);
  } catch (err) {
    console.error('  ✗ LeetCode fetch failed:', (err as Error).message);
  }
}

async function main() {
  console.log('🚀 Fetching profile data...\n');

  await Promise.all([
    fetchGitHubData(),
    fetchMediumPosts(),
    fetchLeetCodeStats(),
  ]);

  fs.writeFileSync(PROFILE_PATH, JSON.stringify(profile, null, 2));
  console.log('\n✅ Profile data saved to data/profile.json');
  console.log('\n⚠️  Don\'t forget to paste your resume text into data/profile.json under "resume_text"!');
}

main();

import { compile } from '@/lib/mdx';
import { readdir, readFile } from 'fs/promises';
import path from 'path';

type Post = {
  slug: string;
  content: string;
};

const basePostsDir = 'posts';

const getSlugs = async (baseDir: string) => {
  const contentsDir = path.join(process.cwd(), baseDir);
  const filenames = await readdir(contentsDir);

  const slugs = filenames.map((filename) => {
    const slug = filename.split('.')[0];

    return slug;
  });

  return slugs;
};

const getTags = async (baseDir: string) => {
  const posts = await loadPosts(baseDir);
  const postTags = posts.map(async (post) => {
    const source = await compile(post.content);
    return source.frontmatter?.tags;
  });
  const tags = (await Promise.all(postTags))
    .flat()
    .filter((tag): tag is string => !!tag);
  const uniqueTags = Array.from(new Set(tags));

  return uniqueTags;
};

const loadPosts = async (baseDir: string): Promise<Post[]> => {
  const contentsDir = path.join(process.cwd(), baseDir);
  const filenames = await readdir(contentsDir);

  const posts = filenames.map(async (filename) => {
    const filepath = path.join(contentsDir, filename);
    const slug = filename.split('.')[0];
    const content = await readFile(filepath, 'utf-8');
    return { slug, content };
  });

  return await Promise.all(posts);
};

const loadPost = async (baseDir: string, slug: string): Promise<Post> => {
  const filename = `${slug}.mdx`;
  const contentsDir = path.join(process.cwd(), baseDir);
  const filenames = await readdir(contentsDir);
  if (!filenames.includes(filename)) {
    return { slug: '', content: '' };
  }

  const filepath = path.join(contentsDir, filename);
  const content = await readFile(filepath, 'utf-8');

  return { slug, content };
};

export { basePostsDir, getSlugs, loadPosts, getTags, loadPost, type Post };
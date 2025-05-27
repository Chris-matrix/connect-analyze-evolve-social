import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create users
  const adminPassword = await hash('admin123', 10);
  const userPassword = await hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      image: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Regular User',
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
      image: 'https://ui-avatars.com/api/?name=Regular+User&background=0D8ABC&color=fff',
    },
  });

  console.log('👤 Created users:', { admin: admin.id, user: user.id });

  // Create social profiles
  const platforms = ['instagram', 'twitter', 'facebook', 'linkedin'];
  const profileData = [];

  for (const userId of [admin.id, user.id]) {
    for (const platform of platforms) {
      const profile = await prisma.socialProfile.upsert({
        where: {
          userId_platform: {
            userId,
            platform,
          },
        },
        update: {},
        create: {
          userId,
          platform,
          username: `${platform}user${userId.substring(0, 4)}`,
          profileUrl: `https://${platform}.com/${platform}user${userId.substring(0, 4)}`,
          connected: true,
          followers: Math.floor(Math.random() * 10000),
        },
      });
      profileData.push(profile);
    }
  }

  console.log(`🔗 Created ${profileData.length} social profiles`);

  // Create social metrics
  const metricsData = [];

  for (const userId of [admin.id, user.id]) {
    for (const platform of platforms) {
      // Create metrics for the last 90 days
      const dailyData = [];
      const now = new Date();
      
      for (let i = 90; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        dailyData.push({
          date: date.toISOString(),
          followers: 1000 + Math.floor(Math.random() * 100) * i,
          engagement: Math.random() * 0.1,
          impressions: 500 + Math.floor(Math.random() * 1000),
          reach: 300 + Math.floor(Math.random() * 700),
        });
      }

      const metrics = await prisma.socialMetrics.upsert({
        where: {
          userId_platform: {
            userId,
            platform,
          },
        },
        update: {},
        create: {
          userId,
          platform,
          metrics: {
            followers: dailyData[dailyData.length - 1].followers,
            following: Math.floor(Math.random() * 1000),
            posts: Math.floor(Math.random() * 500),
            likes: Math.floor(Math.random() * 50000),
            comments: Math.floor(Math.random() * 10000),
            shares: Math.floor(Math.random() * 5000),
            impressions: Math.floor(Math.random() * 100000),
            reach: Math.floor(Math.random() * 70000),
            engagement: Math.random() * 0.1,
          },
          dailyData,
        },
      });
      metricsData.push(metrics);
    }
  }

  console.log(`📊 Created ${metricsData.length} social metrics records`);

  // Create content suggestions
  const contentData = [];
  const statuses = ['pending', 'approved', 'rejected', 'published'];
  const mediaTypes = ['image', 'video', 'carousel', 'text'];
  const contentIdeas = [
    {
      title: 'Product Showcase',
      content: 'Check out our latest product line! Perfect for the summer season. #newproduct #summer',
      tags: ['newproduct', 'summer', 'launch'],
    },
    {
      title: 'Industry Insights',
      content: 'Our latest research shows that 78% of customers prefer sustainable products. What are your thoughts on sustainability in our industry?',
      tags: ['research', 'sustainability', 'industry'],
    },
    {
      title: 'Team Spotlight',
      content: 'Meet our amazing team member, Jane! She\'s been with us for 5 years and leads our design department. #teamspotlight #meettheteam',
      tags: ['team', 'spotlight', 'behindthescenes'],
    },
    {
      title: 'Customer Testimonial',
      content: '"This product changed my life!" - Sarah K. We love hearing from our satisfied customers! #testimonial #customerlove',
      tags: ['testimonial', 'customer', 'review'],
    },
    {
      title: 'Industry Event',
      content: 'We\'re excited to announce that we\'ll be attending the Annual Industry Conference next month! Come visit our booth #203 to learn about our latest innovations.',
      tags: ['event', 'conference', 'networking'],
    },
  ];

  for (const userId of [admin.id, user.id]) {
    for (const platform of platforms) {
      for (const idea of contentIdeas) {
        const suggestion = await prisma.contentSuggestion.create({
          data: {
            userId,
            platform,
            title: idea.title,
            content: idea.content,
            mediaType: mediaTypes[Math.floor(Math.random() * mediaTypes.length)],
            suggestedTags: idea.tags,
            bestTimeToPost: new Date(Date.now() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
            aiGeneratedScore: Math.random() * 100,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            engagement: {
              likes: Math.floor(Math.random() * 1000),
              comments: Math.floor(Math.random() * 200),
              shares: Math.floor(Math.random() * 100),
              impressions: Math.floor(Math.random() * 10000),
            },
          },
        });
        contentData.push(suggestion);
      }
    }
  }

  console.log(`💡 Created ${contentData.length} content suggestions`);
  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

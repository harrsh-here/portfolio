export const projects = [
  {
    id: 'movie-recommender',
    title: 'Movie Recommender System',
    description:
      'A content-based recommendation engine built with KNN and Cosine Similarity. Analyzes genre patterns and movie popularity to suggest top-N similar titles from the MovieLens 100k dataset.',
    tags: ['AI/ML', 'Python', 'FastAPI'],
    stack: ['Python', 'scikit-learn', 'FastAPI', 'Pandas', 'SciPy'],
    status: 'Live',
    featured: true,
    github: 'https://github.com/harrsh-here/-movie-recommender',
    link: '/projects/movie-recommender',
  },
  {
    id: 'student-placement-predictor',
    title: 'Student Placement Predictor',
    description:
      'My first end-to-end ML project. Predicts placement likelihood from CGPA and IQ using Logistic Regression with a StandardScaler pipeline. Built with Flask and deployed to production.',
    tags: ['AI/ML', 'Python', 'Flask'],
    stack: ['Python', 'scikit-learn', 'Flask', 'NumPy', 'Pandas'],
    status: 'Live',
    featured: true,
    github: 'https://github.com/harrsh-here/placement-predictor',
    link: '/projects/student-placement-predictor',
  },
  {
    id: 'portfolio-website',
    title: 'Interactive Portfolio OS',
    description:
      'A highly interactive, deeply stylized personal portfolio built to mimic a futuristic sci-fi terminal. Features a custom 2D canvas particle engine, dynamic theme switching, and glassmorphic UI elements.',
    tags: ['Web'],
    stack: ['React', 'Vite', 'Tailwind CSS', 'Lucide Icons'],
    status: 'Live',
    featured: true,
    github: 'https://github.com/harrsh-here/portfolio',
    link: '/projects/portfolio',
  },
  {
    id: 'coming-soon',
    title: 'More Projects Coming Soon',
    description: 'Working on new ML and data projects. Star the GitHub profile.',
    tags: ['In Progress'],
    stack: [],
    status: 'In Progress',
    featured: false,
    github: 'https://github.com/harrsh-here',
    link: null,
  },
]

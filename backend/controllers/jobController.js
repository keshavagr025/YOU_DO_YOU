import axios from 'axios';

export const fetchJobs = async (req, res) => {
  const { query = 'developer', location = 'remote', page = '1' } = req.query;

  const options = {
    method: 'GET',
    url: 'https://jsearch.p.rapidapi.com/search',
    params: {
      query: `${query} in ${location}`,
      page,
      num_pages: '1'
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    const jobs = response.data.data;

    // Optional: Format for frontend
    const formatted = jobs.map(job => ({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city || job.job_country || 'N/A',
      type: job.job_employment_type || 'N/A',
      salary: job.job_salary ? job.job_salary : 'Not specified',
      postedAt: new Date(job.job_posted_at_datetime_utc),
      description: job.job_description,
      requirements: [job.job_required_experience, job.job_required_education]
        .filter(Boolean)
        .flatMap(Object.values)
        .filter(v => typeof v === 'string'),
      applyUrl: job.job_apply_link || '#'
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error('❌ Error fetching jobs:', err.message);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

import { useState, useEffect } from 'react';
import axios from 'axios';

const Search = () => {
  const [term, setTerm] = useState('programming');
  const [debouncedTerm, setDebouncedTerm] = useState('programming');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTerm(term);
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [term]);

  useEffect(() => {
    const search = async () => {
      const {
        data: {
          query: { search },
        },
      } = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          list: 'search',
          origin: '*',
          format: 'json',
          srsearch: debouncedTerm,
        },
      });

      setResults(search);
    };
    search();
  }, [debouncedTerm]);

  /* useEffect(() => {
    // setTimeout을 사용해 타이핑 할때마다 리퀘스트를 날리는 것을 방지. 하지만 딜레이(rebouncing) 발생
    // 해결책으로 처음에는 setTimeout 패스
    if (term && !results.length) {
      search();
    } else {
      const timeoutId = setTimeout(() => {
        if (term) {
          search();
        }
      }, 500);

      console.log('Initial render or term was changed');

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [term, results.length]); */

  const redneredResults = results.map((result) => {
    return (
      <div key={result.pageid} className='item'>
        <div className='content'>
          <div className='right floated content'>
            <a
              className='ui button'
              href={`https://en.wikipedia.org?curid=${result.pageid}`}
            >
              Go
            </a>
          </div>
          <div className='header'>{result.title}</div>
          <span dangerouslySetInnerHTML={{ __html: result.snippet }}></span>
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className='ui form'>
        <div className='field'>
          <label>Enter Search Term</label>
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className='input'
          />
        </div>
      </div>
      <div className='ui celled list'>{redneredResults}</div>
    </div>
  );
};

export default Search;

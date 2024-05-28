import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import useWindowWidth from '../hooks/useWindowWidth';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { isSmallerDevice } = useWindowWidth();

  useEffect(() => {
    const fetchPost = async () => {
      const limit = isSmallerDevice ? 5 : 10;
      const start = (currentPage - 1) * limit;
      const { data: newPosts } = await axios.get('/api/v1/posts', {
        params: { start, limit },
      });
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
    };

    fetchPost();
  }, [isSmallerDevice, currentPage]);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const limit = isSmallerDevice ? 5 : 10;
      const start = currentPage * limit;
      const { data: newPosts } = await axios.get('/api/v1/posts', {
        params: { start, limit },
      });

      if (newPosts.length === 0) {
        console.log('No more posts to load');
      } else {
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setCurrentPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <PostListContainer>
        {posts.map(post => (
          <Post post={post} key={post.id} />
        ))}
      </PostListContainer>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <LoadMoreButton onClick={handleClick} disabled={isLoading}>
          {!isLoading ? 'Load More' : 'Loading...'}
        </LoadMoreButton>
      </div>
    </Container>
  );
}

import axios from 'axios';
import React, { useCallback, useMemo } from 'react';
import { AiOutlinePlus, AiOutlineCheck } from 'react-icons/ai';

import useCurrentUser from '@/hooks/useCurrentUser';
import useFavorites from '@/hooks/useFavorites';

interface FavoriteButtonProps {
  movieId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieId }) => {
  const { mutate: mutateFavorites } = useFavorites();
  const { data: currentUser, mutate } = useCurrentUser();

  const isFavorite = useMemo(() => {
    const list = currentUser?.favoriteIds || [];
    return list.includes(movieId);
  }, [currentUser, movieId]);

  const toggleFavorites = useCallback(async () => {
    let response;

    if (isFavorite) {
      response = await axios.delete('/api/favorite', { data: { movieId } });
    } else {
      response = await axios.post('/api/favorite', { movieId });
    }

    const updatedFavoriteIds = response?.data?.favoriteIds;
    console.log('Updated Favorite IDs:', updatedFavoriteIds);

    mutate(
      {
        ...currentUser,
        favoriteIds: updatedFavoriteIds,
      },
      false
    ); // false를 사용하면 SWR의 내부 캐시가 바로 갱신되지 않음

    mutateFavorites(); // 이걸 통해 최신화
  }, [movieId, isFavorite, currentUser, mutate, mutateFavorites]);

  const Icon = isFavorite ? AiOutlineCheck : AiOutlinePlus;

  return (
    <div
      onClick={toggleFavorites}
      className='
        cursor-pointer
        group/item
        w-6
        h-6
        lg:w-10
        lg:h-10
        border-white
        border-2
        rounded-full
        flex
        justify-center
        items-center
        transition
        hover:border-neutral-300
      '>
      <Icon className='text-white' size={25} />
    </div>
  );
};

export default FavoriteButton;

export const postUserSelect = {
  id: true,
  name: true,
  username: true,
}

export const postCountSelect = {
  likes: true,
  bookmarks: true,
  comments: true,
}

export const postCardInclude = (userId: number) => ({
  user: {
    select: postUserSelect,
  },
  _count: {
    select: postCountSelect,
  },
  likes: {
    where: {
      userId,
    },
  },
  bookmarks: {
    where: {
      userId,
    },
  },
})
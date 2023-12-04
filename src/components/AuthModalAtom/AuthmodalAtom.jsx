import { atom } from "recoil";

const defaultModalState = {
  open: false,
  view: "login",
};

export const authModalState = atom({
  key: "authModalState",
  default: defaultModalState,
});




export const currentCommunityState = atom({
  key: "currentCommunityState",
  default: null,
});


export const commentsState = atom({
  key: 'commentsState',
  default: [],
});

export const defaultCommunityState = {
  mySnippets: [],
  initSnippetsFetched: false,
  visitedCommunities: {},
  currentCommunity: [],
};

export const communityState = atom({
  key: "communitiesState",
  default: defaultCommunityState,
});


const defaultPostState ={
  selectedPost: null,
  posts: [],
  postVotes: [],
}

export const poststate= atom({
  key: 'poststate',
  default: defaultPostState,
})
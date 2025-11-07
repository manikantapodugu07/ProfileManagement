import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// revisit these imports later — might prune unused ones




export let useAppDispatch: () => AppDispatch = useDispatch;
export let useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

 

import {View, Text, Pressable, StyleSheet, Image} from 'react-native';
import {color, fontsizes} from '@/components/theme';
import {ChipPicker} from '@/features/wardrobe/components/ChipPicker';
import {formatDate} from '@/utils/date';

type Props = { outfitID?: string ; onOpenHistory: () => void}
const vm = { usePlannerViewModel: (outfitID)};


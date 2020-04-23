import React from 'react';
import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      color: 'rgba(255, 255, 255, 0.54)',
    },
  })
);

interface ProductCategory {
  name: string;
  imageUri: string;
  subTitle?: string;
  actionIcon?: React.ReactNode;
}
interface Props {
  productCategory: ProductCategory;
}

export const ProductCategory = (props: Props) => {
  const classes = useStyles();
  const {productCategory} = props;
  return (
    <GridListTile>
      <img src={productCategory.imageUri} alt="images" />
      <GridListTileBar
        title={productCategory.name}
        subtitle={<span>{productCategory.subTitle}</span>}
        actionIcon={
          <IconButton
            aria-label={`info about ${productCategory.name}`}
            className={classes.icon}
          >
            <InfoIcon />
          </IconButton>
        }
      />
    </GridListTile>
  );
};

import React from 'react';
import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import {useFragment} from 'relay-hooks';
import {ProductCategories_categories$key} from './__generated__/ProductCategories_categories.graphql';
import graphql from 'babel-plugin-relay/macro';
import { Container, Box, Slide } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginBottom: theme.spacing(8)
    },
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: 'transparent',
      marginBottom: theme.spacing(2)
    },
    gridList: {
      marginBottom: theme.spacing(2)
    },
    icon: {
      color: 'rgba(255, 255, 255, 0.54)',
    },
    listSubheader: {
      background: theme.palette.common.white,
    },
  })
);

/**
 * The example data is structured as follows:
 *
 * import image from 'path/to/image.jpg';
 * import { useFragment } from 'relay-hooks';
[etimport { Box } from '@material-ui/core/Box/Box';
c...]
 *
 * const tileData = [
 *   {
 *     img: image,
 *     title: 'Image',
 *     author: 'author',
 *   },
 *   {
 *     [etc...]
 *   },
 * ];
 */

const PRODUCT_CATEGORIES_FRAGMENT = graphql`
  fragment ProductCategories_categories on Viewer {
    productsByCategory {
      name
      imageUri
      products {
        id
        detail {
          name
        }
        currentAvailability {
          availability
        }
      }
    }
  }
`;

interface Props {
  categoriesRef: ProductCategories_categories$key;
}

export const ProductCategories = (props: Props) => {
  const classes = useStyles();
  const categories = useFragment(
    PRODUCT_CATEGORIES_FRAGMENT,
    props.categoriesRef
  );
  return (
    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
        <Container className={classes.container}>
    <div className={classes.root}>
    <Box mt={3}>
      <GridList cellHeight={180} className={classes.gridList}>
        {/* <GridListTile key="Subheader" cols={2} style={{height: 'auto'}}>
          <ListSubheader component="div" className={classes.listSubheader}>
            December
          </ListSubheader>
        </GridListTile> */}
        {categories.productsByCategory.map((category) => (
          <GridListTile key={category.name}>
            <img
              src={require(`../../assets/categories/${category.imageUri}`)}
              alt={category.imageUri}
            />
            <GridListTileBar
              title={category.name}
              // subtitle={<span>by: {category.}</span>}
              actionIcon={
                <IconButton
                  aria-label={`info about ${category.name}`}
                  className={classes.icon}
                >
                  <InfoIcon />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
      </Box>
    </div>
    </Container>
    </Slide>
     );
};

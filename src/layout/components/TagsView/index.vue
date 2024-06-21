<template>
  <div id="tags-view-container" class="tags-view-container">
    <div class="app-process">
      <ul class="app-process__op" style="border-radius: 5px;">
        <li class="item" @click="toBack">
          <i class="cl-iconfont el-icon-arrow-left"></i>
        </li>
        <li class="item" @click="toRefresh">
          <i class="cl-iconfont el-icon-refresh"></i>
        </li>
        <li class="item" @click="toHome">
          <i class="cl-iconfont el-icon-house"></i>
        </li>
      </ul>
      <scroll-pane ref="scrollPane" class="tags-view-wrapper"  @scroll="handleScroll" >
      <div style="display: flex;
          align-items: center;
          border-radius: 4px; 
          height: 25px;
          margin-right: 10px;
          cursor: pointer;">
        <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag)?'active':''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        :style="activeStyle(tag)"
        @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
        @contextmenu.prevent.native="openMenu(tag,$event)"
      >
        {{ tag.title }}
        <span v-if="!isAffix(tag)" @click.prevent.stop="closeSelectedTag(tag)" class="el-icon-close"></span>
      </router-link>
      </div>
      
    </scroll-pane>
    <ul v-show="visible" :style="{left:left+'px',top:(parseInt(top)-50) +'px'}" class="contextmenu">
      <!-- <li @click="refreshSelectedTag(selectedTag)"><i class="el-icon-refresh-right"></i> 刷新页面</li> -->
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)"><i class="el-icon-back"></i> 关闭当前</li>
      <li @click="closeOthersTags"><i class="el-icon-circle-close"></i> 关闭其他</li>
      <li v-if="!isFirstView()" @click="closeLeftTags"><i class="el-icon-back"></i> 关闭左侧</li>
      <li v-if="!isLastView()" @click="closeRightTags"><i class="el-icon-right"></i> 关闭右侧</li>
      <li @click="closeAllTags(selectedTag)"><i class="el-icon-circle-close"></i> 全部关闭</li>
    </ul>
    </div>
    
  </div>
</template>

<script>
import ScrollPane from './ScrollPane'
// import path from 'path'
import path from 'path-browserify';
export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: []
    }
  },
  computed: {
    visitedViews() {
      console.log(this.$store.state.tagsView.visitedViews)
      return this.$store.state.tagsView.visitedViews
    },
    routes() {
      return this.$store.state.permission.routes
    },
    theme() {
      return this.$store.state.settings.theme;
    }
  },
  watch: {
    $route() {
      this.addTags()
      this.moveToCurrentTag()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.initTags()
    this.addTags()
  },
  methods: {
    // 刷新当前路由
     toRefresh() {
      mitt.emit("view.refresh");
    },
    // 回首页
    toHome() {
      this.$router.push("/");
    },
    // 返回上一页
    toBack() {
      this.$router.back();
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    activeStyle(tag) {
      if (!this.isActive(tag)) return {};
      return {
        "background-color": this.theme,
        "border-color": this.theme
      };
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix
    },
    isFirstView() {
      try {
        return this.selectedTag.fullPath === '/index' || this.selectedTag.fullPath === this.visitedViews[1].fullPath
      } catch (err) {
        return false
      }
    },
    isLastView() {
      try {
        return this.selectedTag.fullPath === this.visitedViews[this.visitedViews.length - 1].fullPath
      } catch (err) {
        return false
      }
    },
    filterAffixTags(routes, basePath = '/') {
      let tags = []
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    },
    initTags() {
      const affixTags = this.affixTags = this.filterAffixTags(this.routes)
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    },
    addTags() {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('tagsView/addView', this.$route)
        if (this.$route.meta.link) {
          this.$store.dispatch('tagsView/addIframeView', this.$route)
        }
      }
      return false
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag)
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch('tagsView/updateVisitedView', this.$route)
            }
            break
          }
        }
      })
    },
    refreshSelectedTag(view) {
      view = this.selectedTag
      this.$tab.refreshPage(view);
      if (this.$route.meta.link) {
        this.$store.dispatch('tagsView/delIframeView', this.$route)
      }
    },
    closeSelectedTag(view) {
      this.$tab.closePage(view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view)
        }
      })
    },
    closeRightTags() {
      this.$tab.closeRightPage(this.selectedTag).then(visitedViews => {
        if (!visitedViews.find(i => i.fullPath === this.$route.fullPath)) {
          this.toLastView(visitedViews)
        }
      })
    },
    closeLeftTags() {
      this.$tab.closeLeftPage(this.selectedTag).then(visitedViews => {
        if (!visitedViews.find(i => i.fullPath === this.$route.fullPath)) {
          this.toLastView(visitedViews)
        }
      })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag.fullPath).catch(()=>{});
      this.$tab.closeOtherPage(this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags(view) {
      this.$tab.closeAllPage().then(({ visitedViews }) => {
        if (this.affixTags.some(tag => tag.path === this.$route.path)) {
          return
        }
        this.toLastView(visitedViews, view)
      })
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
    openMenu(tag, e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY
      this.visible = true
      this.selectedTag = tag
    },
    closeMenu() {
      this.visible = false
    },
    handleScroll() {
      this.closeMenu()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-icon-close {
  display: none;
  font-size:10px;
}
.tags-view-item:hover .el-icon-close {
  display: inline-block;
  margin-left: 8px;
  // background-color: #ddd;
  color: red;
  font-size: 15px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.tags-view-container {
  height: 34px;
  width: 100%;
  background-color: #f4f4f4;
  margin-top: 5px;
  // border-bottom: 1px solid #d8dce5;
  // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  .tags-view-wrapper {
    align-items: center;
    .tags-view-item {
      display: inline-flex;
      align-items: center;
      border-radius: 4px;
      position: relative;
      cursor: pointer;
      height: 30px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.app-process__op {
		border-radius: 4px;

    padding: 0; /* Remove default padding */
    margin: 0; /* Remove default margin */
		.item {
      position: relative;
			padding: 0 10px;
			line-height: 30px;
			
			cursor: pointer;
			font-weight: bold;
			&:not(:last-child)::after {
				display: block;
				content: "";
				position: absolute;
				right: 0;
				top: calc(50% - 5px);
				height: 10px;
				width: 1px;
				background-color: #eee;
			}

			&:hover {
				color: var(--el-color-primary);
			}
      
		}
	}
  i {
    &:hover {
      color: #ff0000 !important;
    }
  }
</style>
<style lang="scss" scoped>
.app-process {
	display: flex;
	// align-items: center;
	height: 30px;
	position: relative;
	margin: 0 0 10px 0;
	padding: 0 10px;
	user-select: none;

	&__op {
		display: flex;
		background-color: #ffffff;
		height: 30px;
		border-radius: 4px;
		margin-right: 10px;
		list-style: none;
    border: 1px solid #d8dce5;
	}

	&__container {
		height: 30px;
		flex: 1;
		position: relative;
		overflow: hidden;
	}

	&__scroller {
		height: 40px;
		width: 100%;
		white-space: nowrap;
		position: absolute;
		left: 0;
		top: 0;
	}

	&__item {
		display: inline-flex;
		align-items: center;
		border-radius: 4px;
		height: 30px;
		padding: 0 10px;
		background-color: #fff;
		font-size: 12px;
		margin-right: 10px;
		color: #909399;
		cursor: pointer;

		

		&:last-child {
			margin-right: 0;
		}

		&:hover {
			&:not(.active) {
				background-color: #eee;
			}
		}

		&.active {
			background-color: var(--color-primary);

			span {
				color: #fff;
			}

			.el-icon {
				color: #fff;
			}
		}

		&:hover,
		&.active {
			.el-icon {
				opacity: 1;
				width: 13px;
				margin-left: 5px;
			}
		}
	}
}
</style>

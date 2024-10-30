<?php
/*
Plugin Name: Manchete Atual - Fotojornal
Plugin URI: http://mancheteatual.com.br/sites/default/files/fotojornal
Description: Brazilian photo news player, customizable, powered with content from Manchete Atual website.
Version: 1.0.3
Author: Luís Peralta @ http://mancheteatual.com.br
Author URI: http://mancheteatual.com.br
License: GPL2
*/

class fotojornal extends WP_Widget {

	private static $player = 1;

	// constructor
	function fotojornal() {
 		$widget_ops = array('classname' => 'my_widget_class', 'description' => __('Brazilian photo news player, customizable, powered with content from Manchete Atual website.', 'fotojornal'));
		parent::WP_Widget(false, $name = __('Manchete Atual Fotojornal', 'fotojornal'), $widget_ops);
	}

	// widget form creation
	function form($instance) {	
		// Check values
		if( $instance) {
		     $title = esc_attr($instance['title']);
			 $playertitle = $instance['playertitle'];
		     $background = esc_attr($instance['background']);
			 $link = esc_attr($instance['link']);
			 $text = esc_attr($instance['text']);
			 $font = esc_attr($instance['font']);
			 $category = esc_attr($instance['category']);
			 $optin = esc_attr($instance['optin']); // Added
		} else {
		     $title = '';
			 $playertitle = '';
			 $background = '';
		     $link = '';
		     $text = '';
			 $font = '';
			 $category = '';
			 $optin = '';
		}
		?>
		<p>
			<label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Widget Title', 'fotojornal'); ?></label>
			<input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $title; ?>" />
		</p>
		<p>
			<label for="<?php echo $this->get_field_id('playertitle'); ?>"><?php _e('Player Title', 'fotojornal'); ?></label>
			<input class="widefat" id="<?php echo $this->get_field_id('playertitle'); ?>" name="<?php echo $this->get_field_name('playertitle'); ?>" type="text" value="<?php echo $playertitle; ?>" />
		</p>
		<p>
			<label for="<?php echo $this->get_field_id('background'); ?>"><?php _e('Background Color:', 'fotojornal'); ?></label>
			<input class="widefat" id="<?php echo $this->get_field_id('background'); ?>" name="<?php echo $this->get_field_name('background'); ?>" type="text" value="<?php echo $background; ?>" />
		</p>
		<p>
			<label for="<?php echo $this->get_field_id('link'); ?>"><?php _e('Link Color:', 'fotojornal'); ?></label>
			<input class="widefat" id="<?php echo $this->get_field_id('link'); ?>" name="<?php echo $this->get_field_name('link'); ?>" type="text" value="<?php echo $link; ?>" />
		</p>
		<p>
			<label for="<?php echo $this->get_field_id('text'); ?>"><?php _e('Text Color:', 'fotojornal'); ?></label>
			<input class="widefat" id="<?php echo $this->get_field_id('text'); ?>" name="<?php echo $this->get_field_name('text'); ?>" type="text" value="<?php echo $text; ?>" />
		</p>
		<p>
			<label for="<?php echo $this->get_field_id('font'); ?>"><?php _e('Font-Family', 'fotojornal'); ?></label>
			<select name="<?php echo $this->get_field_name('font'); ?>" id="<?php echo $this->get_field_id('font'); ?>" class="widefat">
			<?php
				$options = array('Arial','Verdana','Tahoma','Georgia');
				foreach ($options as $option) {
					echo '<option value="' . $option . '" id="' . $option . '"', $font == $option ? ' selected="selected"' : '', '>', $option, '</option>';
				}
			?>
			</select>
		</p>
		<p>
			<label for="<?php echo $this->get_field_id('category'); ?>"><?php _e('Category', 'fotojornal'); ?></label>
			<select name="<?php echo $this->get_field_name('category'); ?>" id="<?php echo $this->get_field_id('category'); ?>" class="widefat">
			<?php
				$options = array(
					'' => false,
					'Brasil' => 'brasil',
					'Ciência & Saúde' => 'ciencia_saude',
					'Economia' => 'economia',
					'Esporte' => 'esporte',
					'Mundo' => 'mundo',
					'Tecnologia' => 'tecnologia',
					'Variedades' => 'variedades'
				);
				foreach ($options as $name => $option) {
					echo '<option value="' . $option . '" id="' . $option . '"', $category == $option ? ' selected="selected"' : '', '>', $name, '</option>';
				}
			?>
			</select>
		</p>
		<p>
			<input id="<?php echo $this->get_field_id('optin'); ?>" name="<?php echo $this->get_field_name('optin'); ?>" type="checkbox" value="1" <?php checked( '1', $optin ); ?> />
			<label for="<?php echo $this->get_field_id('optin'); ?>"><?php _e('Support Manchete Atual', 'fotojornal'); ?></label>
		</p>

		<?php
	}

	// widget update
	function update($new_instance, $old_instance) {
		$instance = $old_instance;
		// Fields
		$instance['title'] = strip_tags($new_instance['title']);
		$instance['playertitle'] = strip_tags($new_instance['playertitle'],"<b>");
		$instance['background'] = strip_tags($new_instance['background']);
		$instance['link'] = strip_tags($new_instance['link']);
		$instance['text'] = strip_tags($new_instance['text']);
		$instance['font'] = strip_tags($new_instance['font']);
		$instance['category'] = strip_tags($new_instance['category']);
		$instance['optin'] = strip_tags($new_instance['optin']);
		return $instance;
	}

	// widget display
	function widget($args, $instance) {
		extract($args);
		
		//allow multiple players on same page
		$player = $this->player = $this->player + 1;
		
		// these are the widget options
		$title = apply_filters('widget_title', $instance['title']);
		$playertitle = str_replace("'",'"',$instance['playertitle']);
		if(empty($playertitle)) $playertitle = "FOTOJORNAL <b>MANCHETE ATUAL</b>";
		$background = $instance['background'];
		$link = $instance['link'];
		$text = $instance['text'];
		$category = $instance['category'];
		$font = $instance['font'];
		$optin = $instance['optin'];

		// Check player options
		if ( $category != '' ) {
			$category = "category: '$category',\n";
		}
		if ( $font != '' ) {
			$font = "font: '$font',\n";
		}
		$bgcolor = $lcolor = $tcolor = '';
		if($background){
			$bgcolor = "background: '$background',\n";
		}
		if($link){
			$lcolor = "link: '$link',\n";
		}
		if($text){
			$tcolor = "text: '$text',\n";
		}
		
		$support = "";
		if( $optin AND $optin == '1' ) {
			$support = '<a href="http://mancheteatual.com.br/">Manchete Atual</a>';
		}

		
		echo $before_widget;
		echo '<div class="widget-text wp_widget_plugin_box">';
		if ($title) echo $before_title . $title . $after_title;
		echo <<<PLAYER
			<div id="fotojornal{$player}">{$support}</div>
			<script type="text/javascript">
				jQuery(document).ready(function(){
					jQuery("#fotojornal1").mancheteatual({
	    				{$category}
	    				{$font}
	    				{$bgcolor}
	    				{$lcolor}
	    				{$tcolor}
	    				title: '{$playertitle}'
					});
				});
			</script>
PLAYER;
		echo "</div>";
		echo $after_widget;
	}
}

// register widget
add_action('widgets_init', create_function('', 'return register_widget("fotojornal");'));

//register css
wp_enqueue_style('fotojornal-css', plugins_url("/css/jquery.mancheteatual.fotojornal.css", __FILE__), false, false, 'all' );

//register plugin
wp_enqueue_script('fotojornal-js', plugins_url("/js/jquery.mancheteatual.fotojornal.js", __FILE__), array('jquery'),false,true);
?>

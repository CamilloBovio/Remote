// $Id: README.txt,v 1.1 2009/09/15 03:34:56 techsoldaten Exp $

CONTENTS OF THIS FILE
---------------------

 * Introduction
 * Installation
 * Configuration and Use


INTRODUCTION
------------

Current Maintainer: Michael Haggerty <http://drupal.org/user/16339>

This project sponsored by:

  Trellon <http://www.trellon.com/>

  Trellon is a strategy and development firm specializing in open source
  content management, CRM, social networking, widget and mobile solutions.
  Since 2004, we have been building great sites with Drupal for non-profit,
  NGO, academic, media, and political clients, as well as socially
  responsible businesses.

The Interface module allows site administrators to modify the default
presentation of forms using a drag-and-drop style of editing.

Features include:

 * Drag-and-Drop Authoring Tool

   Form elements can be moved around on a page by simply clicking
   on them and dragging them where they belong.

 * Templates

   Templates control where form elements can be located on the page, allowing
   administrators to create layouts featuring multiple columns, rows and
   unique designs. Templates can override  settings within the theme for
   the site, providing additional options for designers.

 * Behaviors

   Behaviors are plug-ins that provide additional functionality for forms
   and form elements. For example: tabbable, a plug-in allowing users to
   dynamically create tab sets within the interface authoring tool.

 * Multiple Interfaces per Content Type

   Each interface is assigned a context, which can be called programmatically.
   This allows different versions of forms to be displayed for a single
   content type within the same site.

* API

  Interface provides ample hooks for templates and behaviors to perform
  actions without needing to modify the core interface module. Documentation
  for developers is provided within some of the behaviors included with
  this distribution.


INSTALLATION
------------

 * This module requires jQuery UI: http://drupal.org/project/jquery_ui

 * Install as usual. See http://drupal.org/node/70151 for more information.


CONFIGURATION AND USE
---------------------

 * Create a new interface by going to Administer > Build > Interface.

   Select a content type for the new interface and select a template, as well
   as enter a context for the interface. A template is a file that controls
   where form items can be placed (amongst other things). A context is a
   name for the interface that is used to call back different versions of
   the form. Use the 'Default' context to modify the default display of
   forms for a content type.

 * Installing New Behaviors and Templates

   New templates can be installed by placing them in the 'templates'
   directory. Behaviors are assigned to templates within the .info file for
   the template. Install behaviors in the behaviors directory and modify the
   .info file for any templates where the behavior is to be used.
  
 * Programmatically Call Interfaces

   Interface supports multiple form layouts through the interface context
   setting. You can call different form contexts through drupal_get_form()
   by adding a variable called 'interface_context' to the node being passed
   into the function. For example:

     <?php
       include_once 'modules/node/node.pages.inc';

       $node = array(
         'uid' => $user->uid, 
         'name' => $user->name, 
         'type' => 'page', 
         'interface_context' => 'yo_yo_yo' // this is the important part
        );
       $output .= drupal_get_form('page_node_form', $node);
       return $output;
     ?>


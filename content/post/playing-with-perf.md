+++
author = "Laurent Aphecetche"
date = "2016-05-19T17:17:15+02:00"
description = ""
tags = [ "geek", "play","misc", "perf" ]
title = "Playing with perf"
lastmod = "2016-05-19"
draft = true
+++

# Playing with perf on Linux (VM SLC6)

Tried a bit with my tiny `webmaker` application :

```
> perf record -e cache-misses ./webmaker --directory /home/laurent/Downloads/tmp --pattern SAF-nansaf
```

Problem is that I then got the message : 

```
WARNING: Kernel address maps (/proc/{kallsyms,modules}) are restricted,
check /proc/sys/kernel/kptr_restrict.
```

So I had to change that (see e.g. [is-there-a-way-to-set-kptr-restrict-to-0](http://stackoverflow.com/questions/20390601/is-there-a-way-to-set-kptr-restrict-to-0))
```
sudo sh -c " echo 0 > /proc/sys/kernel/kptr_restrict"
```

That way I got : 

```
> perf record -e cache-misses ./webmaker --directory /home/laurent/Downloads/tmp --pattern SAF-nansaf
587918 lines
[ perf record: Woken up 7 times to write data ]
[ perf record: Captured and wrote 1.975 MB perf.data (~86284 samples) ]

```

```
> perf report --stdio
# To display the perf.data header info, please use --header/--header-only options.
#
# Samples: 51K of event 'cache-misses'
# Event count (approx.): 106569532
#
# Overhead   Command        Shared Object                                                                                                 
# ........  ........  ...................  ..................................................................................................................
#
     9.82%  webmaker  webmaker             [.] AFWebMaker::SumSize(std::list<AFWebMaker::AFFileInfo, std::allocator<AFWebMaker::AFFileInfo> > const&) const  
     7.75%  webmaker  [kernel.kallsyms]    [k] clear_page                                                                                                    
     6.69%  webmaker  libstdc++.so.6.0.13  [.] std::basic_string<char, std::char_traits<char>, std::allocator<char> >::~basic_string()                       
     5.10%  webmaker  libc-2.12.so         [.] malloc_consolidate                                                                                            
     4.80%  webmaker  [kernel.kallsyms]    [k] memset                                                                                                        
     4.72%  webmaker  libc-2.12.so         [.] _int_malloc                                                                                                   
     4.26%  webmaker  libc-2.12.so         [.] _int_free                                                                                                     
     2.35%  webmaker  webmaker             [.] AFWebMaker::~AFWebMaker()                                                                                     
     2.18%  webmaker  webmaker             [.] AFWebMaker::GeneratePieCharts()                                                                               
     2.03%  webmaker  libc-2.12.so         [.] __strlen_sse2                                                                                                 
     1.86%  webmaker  webmaker             [.] AFWebMaker::GenerateDatasetList()                                                                             
     1.71%  webmaker  webmaker             [.] AFWebMaker::AddFileToGroup(std::string const&, AFWebMaker::AFFileInfo const&)
```

Using the report option without --stdio one gets an interactive text user interface where each line of the
report can be e.g. annotated (that is, you get a mix of source code and assembly).

```
   //_________________________________________________________________________________________________                                             ▒
       │    AFWebMaker::AFFileSize AFWebMaker::SumSize(const AFFileInfoList& list) const                                                                    ▒
       │    {                                                                                                                                               ▒
       │      AFFileSize thesize(0);                                                                                                                        ▒
       │                                                                                                                                                    ▒
       │      for ( AFFileInfoList::const_iterator it = list.begin(); it != list.end(); ++it )                                                              ▒
  0,10 │      xor    %eax,%eax                                                                                                                              ▒
       │      cmp    %rsi,%rdx                                                                                                                              ▒
       │    ↓ je     1c                                                                                                                                     ▒
       │      nop                                                                                                                                           ▒
       │      {                                                                                                                                             ▒
       │        thesize += it->fSize;                                                                                                                       ▒
  0,40 │10:   add    0x10(%rdx),%rax                                                                                                                        ▒
       │          { return &static_cast<_Node*>(_M_node)->_M_data; }                                                                                        ▒
       │                                                                                                                                                    ▒
       │          _Self&                                                                                                                                    ▒
       │          operator++()                                                                                                                              ▒
       │          {                                                                                                                                         ▒
       │            _M_node = _M_node->_M_next;                                                                                                             ▒
 97,24 │      mov    (%rdx),%rdx                                                                                                                            ▒
       │    //_________________________________________________________________________________________________                                             ▒
       │    AFWebMaker::AFFileSize AFWebMaker::SumSize(const AFFileInfoList& list) const                                                                    ▒
       │    {                                                                                                                                               ◆
       │      AFFileSize thesize(0);                                                                                                                        ▒
       │                                                                                                                                                    ▒
       │      for ( AFFileInfoList::const_iterator it = list.begin(); it != list.end(); ++it )                                                              ▒
  2,26 │      cmp    %rsi,%rdx                                                                                                                              ▒
       │    ↑ jne    10                                                                                                                                     ▒
       │      {                                                                                                                                             ▒
       │        thesize += it->fSize;                                                                                                                       ▒
       │      }                                                                                                                                             ▒
       │      return thesize;                                                                                                                               ▒
       │    }                                                                                                                                               ▒
       │1c:   repz   retq               
```

Which seems to indicate that the choice a linked-list as my primary data structure was ill-advised in this
case. 

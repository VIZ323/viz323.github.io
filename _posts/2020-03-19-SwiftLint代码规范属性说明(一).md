SwiftLint代码规范属性说明(一)
====================

规则系列文章为转载，网页格式存在一些问题，在此仅作为记录使用
一： https://www.jianshu.com/p/328091791033
二： https://www.jianshu.com/p/146bd915c8a1
三： https://www.jianshu.com/p/58fe2e9247e8



> 
> *   [Github 公布的 Swift 代码规范--原文](https://link.jianshu.com?t=https%3A%2F%2Fgithub.com%2Fgithub%2Fswift-style-guide)
> *   [Github 公布的 Swift 代码规范--中文](https://link.jianshu.com?t=https%3A%2F%2Fgithub.com%2FArtwalk%2Fswift-style-guide%2Fblob%2Fmaster%2FREADME_CN.md)
> *   [官方的SwiftLint规则说明](https://link.jianshu.com?t=https%3A%2F%2Fgithub.com%2Frealm%2FSwiftLint%2Fblob%2Fmaster%2FRules.md)

以下个属性均按照字母顺序排列
--------------

### 规则1: closing\_brace

在使用Swift 3.2或更高版本时，首选系统的KVO 的API和keypath

识别码

默认是否启用

是否支持自动更正

类型

block\_based\_kvo

启用

no

idiomatic

官方示例:

    //编译通过
    let observer = foo.observe(\.value, options: [.new]) { (foo, change) in
       print(change.newValue)
    }
    
    //会触发警告
    class Foo: NSObject {
       override func observeValue(forKeyPath keyPath: String?, of object: Any?,
                                   change: [NSKeyValueChangeKey : Any]?,
                                   context: UnsafeMutableRawPointer?) {}
    }
    

### 规则2: class\_delegate\_protocol

委托协议应该只是class类，可以被弱引用(官方解释,先放出官方示例吧)

识别码

默认是否启用

是否支持自动更正

类型

class\_delegate\_protocol

启用

no

lint

示例:

    //不会触发warning
    protocol FooDelegate: class {}
    protocol FooDelegate: class, BarDelegate {}
    protocol Foo {}
    class FooDelegate {}
    @objc protocol FooDelegate {}
    @objc(MyFooDelegate)
    protocol FooDelegate {}
    protocol FooDelegate: BarDelegate {}
    protocol FooDelegate: AnyObject {}
    protocol FooDelegate: NSObjectProtocol {}
    
    //会触发warning
    protocol FooDelegate {}
    protocol FooDelegate: Bar {}
    

### 规则3: closing\_brace

类似小括号包含大括号的不能用空格

识别码

默认是否启用

是否支持自动更正

类型

closing\_brace

启用

yes

style

具体示例:

    //不会触发warning
    [1, 2].map({ $0 })
    
    [1, 2].map(
      { $0 }
    )
    
    //会触发warning
    [1, 2].map({ $0 } )
    [1, 2].map({ $0 }   )
    [1, 2].map( { $0 })
    

### 规则4: closure\_end\_indentation

闭包的封闭端和开始端有相同的缩进, 意思就是 大括号（一般是方法）上下对齐的问题，这样使code看起来更加整洁

识别码

默认是否启用

是否支持自动更正

类型

closure\_end\_indentation

未启用

no

style

具体示例:

    //不会触发closure_end_indentation
    [1, 2].map { $0 + 1 }
    //不会触发closure_end_indentation
    SignalProducer(values: [1, 2, 3])
       .startWithNext { number in
           print(number)
       }
    //不会触发closure_end_indentation
    function {
        ..........
    }
    
    //会触发closure_end_indentation
    SignalProducer(values: [1, 2, 3])
       .startWithNext { number in
           print(number)
    }
    //不会触发closure_end_indentation
    function {
        ..........
      }
    

### 规则5: closure\_parameter\_position

闭包参数位置， 闭包参数应该和大括号左边在同一行, 推荐使用

识别码

默认是否启用

是否支持自动更正

类型

closure\_parameter\_position

启用

no

style

具体示例:

    /// number 和 { 在同一行, 不会触发warning
    let names = [1, 2, 3]
    names.forEach { (number) in
        print(number)
    }
    
    let names = [1, 2, 3]
    names.map { number in
        number + 1
    }
    
    
    
    /// 这样不行，违背 closure_parameter_position规则, 触发warning
    let names = [1, 2, 3]
    names.forEach { 
        (number) in
        print(number)
    }
    
     let names = [1, 2, 3]
     names.map {
         number in
         number + 1
     }
    

### 规则6: closure\_spacing

在闭包的{}中间要有一个空格,如map({ $0 })

识别码

默认是否启用

是否支持自动更正

类型

closure\_spacing

未启用

yes

style

以下示例:

    不会触发警告
    map({ $0 })
    [].map ({ $0.description })
    
    //会触发警告
    map({$0 })
    map({ $0})
    map({$0})
    [].map ({$0.description     })
    

### 规则7: colon

冒号的使用， swiftlint的这个colon属性规则很简单，要求“ ：”紧靠所定义的常量或变量等，必须没有空格，与所指定的类型之间必须只有一个空格，多一个或少一个都不行，如果是用在Dictionary中，则要求紧靠Key，与Value之间必须有且仅有一个空格。这个规则我觉得应该强制推荐使用

识别码

默认是否启用

是否支持自动更正

类型

colon

启用

yes

style

具体示例:

    //不会触发警告
    let abc: String = "jun"
    let abc = [1: [3: 2], 3: 4]
    let abc = [1: [3: 2], 3: 4]
    
    //会触发警告
    let jun:Void
    let jun : Void
    let jun :Void
    let jun:   Void
    

### 规则8: comma

逗号使用只要遵循“前不离身后退一步”就行了，这个也强制推荐使用

识别码

默认是否启用

是否支持自动更正

类型

comma

启用

yes

style

具体示例:

    //不触发警告
    [a, b, c, d]
    
    //触发警告
    [a ,b]
    

### 规则9: compiler\_protocol\_init

编译器协议初始化, 不建议.init等初始化方式, 建议使用简单的初始化形式

识别码

默认是否启用

是否支持自动更正

类型

compiler\_protocol\_init

启用

no

lint

官方示例:

        public static let description = RuleDescription(
            identifier: "compiler_protocol_init",
            name: "Compiler Protocol Init",
            description: "The initializers declared in compiler protocols such as `ExpressibleByArrayLiteral` " +
                         "shouldn't be called directly.",
            kind: .lint,
            nonTriggeringExamples: [
                "let set: Set<Int> = [1, 2]\n",
                "let set = Set(array)\n"
            ],
            triggeringExamples: [
                "let set = ↓Set(arrayLiteral: 1, 2)\n",
                "let set = ↓Set.init(arrayLiteral: 1, 2)\n"
            ]
        )
    

### 规则10: conditional\_returns\_on\_newline

条件语句不能写在同一行, 条件返回语句应该在新的一行。 当有条件返回的时候应该换行返回，而不是在同一行

识别码

默认是否启用

是否支持自动更正

类型

conditional\_returns\_on\_newline

未启用

no

style

具体示例:

    /// swiftlint 不推荐的写法, 否则会触发warning
    if true { return }
    guard true else { return }
    
    /// swiftlint 推荐的写法
    if true {
        return
    }
    
    guard true else {
        return 
    }
    

### 规则11: contains\_over\_first\_not\_nil

类似first函数不能判断是否为nil

识别码

默认是否启用

是否支持自动更正

类型

contains\_over\_first\_not\_nil

未启用

no

performance

具体示例:

    //推荐写法
    let first = myList.first(where: { $0 % 2 == 0 })
    let first = myList.first { $0 % 2 == 0 }
    
    //不推荐写法
    myList.first { $0 % 2 == 0 } != nil
    myList.first(where: { $0 % 2 == 0 }) != nil
    

### 规则12: control\_statement

控制语句, for，while，do，catch语句中的条件不能包含在()中

识别码

默认是否启用

是否支持自动更正

类型

control\_statement

启用

no

style

具体示例:

    //建议写法
    if condition {
    if (a, b) == (0, 1) {
    
    //不建议写法
    if (condition) {
    if(condition) {
    if ((a || b) && (c || d)) {
    

### 规则13: custom\_rules

自定义规则。 这个属性可以通过提供正则表达式来创建自定义规则， 可选指定语法类型搭配， 安全、级别和要陈列的什么信息。 这个属性只要熟悉使用正则表达式的人使用，目前可以不适用

识别码

默认是否启用

是否支持自动更正

类型

custom\_rules

启用

no

style

### 规则14: cyclomatic\_complexity

循环复杂度。函数体的复杂度应该要限制，这个属性主要约束条件句、循环句中的循环嵌套问题， 当嵌套太多的循环时，则会触发swiftlint中的warning和error，当达到10个循环嵌套时就会报warning，达到20个循环嵌套时就会报error

识别码

默认是否启用

是否支持自动更正

类型

cyclomatic\_complexity

启用

no

metrics

### 规则15: discarded\_notification\_center\_observer

当使用注册的通知时, 应该存储返回的观察者, 便于用完之后移除通知

识别码

默认是否启用

是否支持自动更正

类型

discarded\_notification\_center\_observer

启用

no

lint

代码示例:

    //推荐写法
    let foo = nc.addObserver(forName: .NSSystemTimeZoneDidChange, object: nil, queue: nil) { }
    
    let foo = nc.addObserver(forName: .NSSystemTimeZoneDidChange, object: nil, queue: nil, using: { })
    
    func foo() -> Any {
       return nc.addObserver(forName: .NSSystemTimeZoneDidChange, object: nil, queue: nil, using: { })
    }
    
    
    //不推荐写法
    nc.addObserver(forName: .NSSystemTimeZoneDidChange, object: nil, queue: nil) { }
    
    nc.addObserver(forName: .NSSystemTimeZoneDidChange, object: nil, queue: nil, using: { })
    
    @discardableResult func foo() -> Any {
       return nc.addObserver(forName: .NSSystemTimeZoneDidChange, object: nil, queue: nil, using: { })
    }
    

### 规则16: discouraged\_direct\_init

阻止直接初始化导致的错误类型, 有类方法的,用类方法初始化(不建议直接init初始化)

识别码

默认是否启用

是否支持自动更正

类型

discouraged\_direct\_init

启用

no

lint

代码示例:

    //建议写法
    let foo = UIDevice.current
    let foo = Bundle.main
    let foo = Bundle(path: "bar")
    let foo = Bundle(identifier: "bar")
    
    //不建议写法
    let foo = UIDevice()
    let foo = Bundle()
    let foo = bar(bundle: Bundle(), device: UIDevice())
    

### 规则17: discouraged\_optional\_boolean

不建议使用可选布尔值

识别码

默认是否启用

是否支持自动更正

类型

discouraged\_optional\_boolean

未启用

no

idiomatic

代码示例:

    //建议写法
    var foo: Bool
    var foo: [String: Bool]
    var foo: [Bool]
    let foo: Bool = true
    
    //不建议写法
    var foo: Bool?
    var foo: [String: Bool?]
    var foo: [Bool?]
    let foo: Bool? = nil
    

### 规则18: discouraged\_object\_literal

优先使用对象初始化方法, 不建议使用代码块初始化

识别码

默认是否启用

是否支持自动更正

类型

discouraged\_object\_literal

未启用

no

idiomatic

代码示例:

    //不建议写法
    let white = #colorLiteral(red: 1.0, green: 1.0, blue: 1.0, alpha: 1.0)
    let image = ↓#imageLiteral(resourceName: "image.jpg")
    

### 规则19: dynamic\_inline

避免一起使用 dynamic 和 @inline(\_ \_always)， 否则报 error

识别码

默认是否启用

是否支持自动更正

类型

dynamic\_inline

启用

no

lint

代码示例:

    /// 正确的做法
    class LangKe {
        dynamic func myFunction() {
    
        }
    }
    
    class LangKe {
        @inline(__always) func myFunction() {
    
        }
    }
    
    class LangKe {
        @inline(never) dynamic func myFunction() {
    
        }
    }
    
    /// 只要同时使用 dynamic 和 @inline(_ _always)都报错 error！！！
    class LangKe {
        @inline(__always) public dynamic func myFunction() {
    
        }
    }
    

### 规则20: array\_init

序列转化成数组时, 优先使用数组转化, 而不是seq.map {$ 0}将序列转换为数组

识别码

默认是否启用

是否支持自动更正

类型

array\_init

未启用

no

lint

官方示例:

        public static let description = RuleDescription(
            identifier: "array_init",
            name: "Array Init",
            description: "Prefer using Array(seq) than seq.map { $0 } to convert a sequence into an Array.",
            kind: .lint,
            
            //以下示例不会触发警告
            nonTriggeringExamples: [
                "Array(foo)\n",
                "foo.map { $0.0 }\n",
                "foo.map { $1 }\n",
                "foo.map { $0() }\n",
                "foo.map { ((), $0) }\n",
                "foo.map { $0! }\n",
                "foo.map { $0! /* force unwrap */ }\n",
                "foo.something { RouteMapper.map($0) }\n"
            ],
            
            //以下示例会触发警告
            triggeringExamples: [
                "↓foo.map({ $0 })\n",
                "↓foo.map { $0 }\n",
                "↓foo.map { return $0 }\n",
                "↓foo.map { elem in\n" +
                "   elem\n" +
                "}\n",
                "↓foo.map { elem in\n" +
                "   return elem\n" +
                "}\n",
                "↓foo.map { (elem: String) in\n" +
                    "   elem\n" +
                "}\n",
                "↓foo.map { elem -> String in\n" +
                "   elem\n" +
                "}\n",
                "↓foo.map { $0 /* a comment */ }\n"
            ]
        )
    

### 规则21: empty\_count

建议使用isEmpty判断,而不是使用count==0判断

识别码

默认是否启用

是否支持自动更正

类型

empty\_count

未启用

no

performance

代码示例:

    /// swiftlint不建议这样使用
    let number = "long"
    if number.characters.count == 0 {
        print("为空")
    } else {
        print("不为空")
    }
    
    /// swiftlint建议这种正式风格
    if number.isEmpty {
        print("为空")
    } else {
        print("不为空")
    }
    

### 规则22: empty\_enum\_arguments

当枚举与关联类型匹配时，如果不使用它们，参数可以省略

识别码

默认是否启用

是否支持自动更正

类型

empty\_enum\_arguments

启用

yes

style

代码示例:

    //SwiftLint建议写法
    switch foo {
        case .bar: break
    }
    switch foo {
        case .bar(let x): break
    }
    switch foo {
        case let .bar(x): break
    }
    switch (foo, bar) {
        case (_, _): break
    }
    switch foo {
        case "bar".uppercased(): break
    }
    
    //SwiftLint不建议写法
    switch foo {
        case .bar(_): break
    }
    switch foo {
        case .bar(): break
    }
    switch foo {
        case .bar(_), .bar2(_): break
    }
    

### 规则23: empty\_parameters

闭包参数为空时,建议使用() ->Void, 而不是Void ->Void

识别码

默认是否启用

是否支持自动更正

类型

empty\_parameters

启用

yes

style

代码示例:

    /// 01 不会触发warning
    let abc: () -> Void
    
    func foo(completion: () -> Void) {
    
    }
    
    /// 02 直接报错
    let bcd: Void -> Void
    
    func foo(completion: Void -> Void) {
    
    }
    

### 规则24: empty\_parentheses\_with\_trailing\_closure

在使用尾随闭包的时候， 应该尽量避免使用空的圆括号

识别码

默认是否启用

是否支持自动更正

类型

empty\_parentheses\_with\_trailing\_closure

启用

yes

style

代码示例:

### 规则25: aaa

...

识别码

默认是否启用

是否支持自动更正

类型

aaa

未启用

no

style

代码示例:

    //不会触发warning
    [1, 2].map { $0 + 1 }
    [1, 2].map({ $0 + 1 })
    [1, 2].reduce(0) { $0 + $1 }
    [1, 2].map { number in
       number + 1 
    }
    
    //会触发warning
    [1, 2].map() { $0 + 1 }
    [1, 2].map( ) { $0 + 1 }
    [1, 2].map() { number in
       number + 1 
    }
    [1, 2].map(  ) { number in
       number + 1 
    }
    

### 规则26: explicit\_acl

...所有属性和方法的声明, 都应该明确指定修饰关键字

识别码

默认是否启用

是否支持自动更正

类型

explicit\_acl

未启用

no

idiomatic

官方代码示例:

    //非触发示例
    internal enum A {}
    public final class B {}
    private struct C {}
    internal func a() { let a =  }
    private struct C { let d = 5 }
    internal class A { deinit {} }
    internal protocol A {
        func b()
        var c: Int
    }
    
    
    //触发示例
    enum A {}
    final class B {}
    internal struct C { let d = 5 }
    public struct C { let d = 5 }
    func a() {}
    internal let a = 0
    func b() {}
    

### 规则27: explicit\_type\_interface

声明的属性应该明确其类型, 如: var myVar: Int = 0

识别码

默认是否启用

是否支持自动更正

类型

explicit\_type\_interface

未启用

no

idomatic

代码示例:

    //推荐写法
    class Foo {
      var myVar: Int? = 0
      let myLet: Int? = 0
    }
    
    //不建议写法
    class Foo {
      var myVar = 0
      let myLet = 0
    }
    

### 规则28: extension\_access\_modifier

在自定义类中,推荐使用extension扩展

识别码

默认是否启用

是否支持自动更正

类型

extension\_access\_modifier

未启用

no

idiomatic

代码示例:

### 规则29: no\_extension\_access\_modifier

在extension扩展前面,不建议使用(fileprivate, public)等修饰符

识别码

默认是否启用

是否支持自动更正

类型

no\_extension\_access\_modifier

未启用

no

idiomatic

代码示例:

    //不建议以下写法
    private extension String {}
    public extension String {}
    open extension String {}
    internal extension String {}
    fileprivate extension String {}
    

### 规则30: fallthrough

switch语句中不建议使用fallthrough

识别码

默认是否启用

是否支持自动更正

类型

fallthrough

启用

no

idiomatic

代码示例:

    //推荐写法
    switch foo {
    case .bar, .bar2, .bar3:
        something()
    }
    
    //不建议写法
    switch foo {
    case .bar:
        fallthrough
    case .bar2:
        something()
    }
    

### 规则31: fatal\_error\_message

执行fatalError错误时,建议有一个提示信息; 如:fatalError("Foo")

识别码

默认是否启用

是否支持自动更正

类型

fatal\_error\_message

未启用

no

idiomatic

代码示例:

    //推荐写法
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    //不建议
    required init?(coder aDecoder: NSCoder) {
        fatalError("")
    }
    
    

### 规则32: file\_header

文件头。新建的文件开始的注释应该一样

识别码

默认是否启用

是否支持自动更正

类型

aaa

未启用

no

style

代码示例:

    /// 不会触发warning
    /// 如果我新建一个工程，在ViewController.swift文件中， 开始的注释应该是：
    
    //  ViewController.swift
    //  SwiftLint
    //
    //  Created by langke on 17/1/17.
    //  Copyright © 2017年 langke. All rights reserved.
    //
    
    改变一下变为：
    //
    //  MyViewController.swift...................由于这里和外面的文件名不一样，所以触发warning（实际上在swift 3.0上测试这个属性暂时没有任何作用！！）
    //  SwiftLint
    //
    //  Created by langke on 17/1/17.
    //   Copyright © 2017年 langke. All rights reserved................官方terminal表示，Copyright和Created没有对齐，也会触发warning！！！
    //
    

### 规则33: file\_length

文件内容行数, 超过400行warning, 超过1000行给error

识别码

默认是否启用

是否支持自动更正

类型

file\_length

启用

no

metrics

代码示例:

### 规则34: first\_where

不建议在使用filter和map函数后直接使用.first

识别码

默认是否启用

是否支持自动更正

类型

first\_where

未启用

no

performance

官方代码示例:

        public static let description = RuleDescription(
            identifier: "first_where",
            name: "First Where",
            description: "Prefer using `.first(where:)` over `.filter { }.first` in collections.",
            kind: .performance,
            
            //不会触发警告
            nonTriggeringExamples: [
                "kinds.filter(excludingKinds.contains).isEmpty && kinds.first == .identifier\n",
                "myList.first(where: { $0 % 2 == 0 })\n",
                "match(pattern: pattern).filter { $0.first == .identifier }\n",
                "(myList.filter { $0 == 1 }.suffix(2)).first\n"
            ],
            //以下写法会触发警告
            triggeringExamples: [
                "↓myList.filter { $0 % 2 == 0 }.first\n",
                "↓myList.filter({ $0 % 2 == 0 }).first\n",
                "↓myList.map { $0 + 1 }.filter({ $0 % 2 == 0 }).first\n",
                "↓myList.map { $0 + 1 }.filter({ $0 % 2 == 0 }).first?.something()\n",
                "↓myList.filter(someFunction).first\n",
                "↓myList.filter({ $0 % 2 == 0 })\n.first\n",
                "(↓myList.filter { $0 == 1 }).first\n"
            ]
        )
    
    

### 规则35: for\_where

在for循环中,不建议使用单个if语句或者只使用一次循环变量,可使用where或者if{}else{}语句

识别码

默认是否启用

是否支持自动更正

类型

for\_where

启用

no

idiomatic

代码示例:

    //推荐写法
    for user in users where user.id == 1 { }
    for user in users {
       if let id = user.id { }
    }
    for user in users {
       if var id = user.id { }
    }
    for user in users {
       if user.id == 1 { } else { }
    }
    for user in users {
       if user.id == 1 { }
       print(user)
    }
    for user in users {
       let id = user.id
       if id == 1 { }
    }
    for user in users {
       if user.id == 1 && user.age > 18 { }
    }
    
    //不建议写法
    for user in users {
       if user.id == 1 { return true }
    }
    

### 规则36: force\_cast

不建议直接强解类型

识别码

默认是否启用

是否支持自动更正

类型

force\_cast

启用

no

idiomatic

代码示例:

    //建议写法
    NSNumber() as? Int
    
    //不推荐
    NSNumber() ↓as! Int
    

### 规则37: force\_try

对会抛出异常(throws)的方法,不建议try!强解

识别码

默认是否启用

是否支持自动更正

类型

force\_try

启用

no

idiomatic

代码示例:

    func myFunction() throws { }
    
    /// 这样写是可以的，不会触发 error
    do {
        try myFunction()
    } catch {
    
    }
    
    /// 这样直接触发 error
    try! myFunction()
    

### 规则38: force\_unwrapping

强制解包/拆包。我们知道，当一个类型是可选类型的时候，当我们获取值时，需要强制解包（也叫隐式解包）, 通常我们是在一个变量或者所需要的常量、类型等后面加一个“ ！”， 然而，swiftlint建议强制解包应该要避免， 否则将给予warning

识别码

默认是否启用

是否支持自动更正

类型

force\_unwrapping

未启用

no

idiomatic

代码示例:

    /// 将触发warning
    navigationController!.pushViewController(myViewController, animated: true)
    
    let url = NSURL(string: "http://www.baidu.com")!
    print(url)
    
    return cell!
    
    /// 不会触发warning
    navigationController?.pushViewController(myViewController, animated: true)
    

### 规则39: function\_body\_length

函数体长度， 函数体不应该跨越太多行， 超过40行给warning， 超过100行直接报错

识别码

默认是否启用

是否支持自动更正

类型

function\_body\_length

启用

no

metrics

代码示例:

### 规则40: function\_parameter\_count

*   函数参数个数， 函数参数数量(init方法除外)应该少点， 不要太多，swiftlint规定函数参数数量超过5个给warning， 超过8个直接报error
*   注：`function_parameter_count: error` 这样并不能改变它的警告或错误，该属性不允许修改，但是可以禁用

识别码

默认是否启用

是否支持自动更正

类型

function\_parameter\_count

启用

no

metrics

代码示例:

### 规则41: generic\_type\_name

泛型类型名称只能包含字母数字字符，以大写字母开头，长度介于1到20个字符之间

识别码

默认是否启用

是否支持自动更正

类型

generic\_type\_name

未启用

no

idiomatic

代码示例:

    //推荐写法
    func foo<T>() {}
    func foo<T>() -> T {}
    func foo<T, U>(param: U) -> T {}
    func foo<T: Hashable, U: Rule>(param: U) -> T {}
    
    //不推荐写法
    func foo<T_Foo>() {}
    func foo<T, U_Foo>(param: U_Foo) -> T {}
    func foo<TTTTTTTTTTTTTTTTTTTTT>() {}
    func foo<type>() {}
    

### 规则42: identifier\_name

变量标识符名称应该只包含字母数字字符，并以小写字母开头或只应包含大写字母。在上述例外情况下，当变量名称被声明为静态且不可变时，变量名称可能以大写字母开头。变量名称不应该太长或太短

识别码

默认是否启用

是否支持自动更正

类型

identifier\_name

启用

no

style

官方给出的示例:

    internal struct IdentifierNameRuleExamples {
        //不会触发error
        static let nonTriggeringExamples = [
            "let myLet = 0",
            "var myVar = 0",
            "private let _myLet = 0",
            "class Abc { static let MyLet = 0 }",
            "let URL: NSURL? = nil",
            "let XMLString: String? = nil",
            "override var i = 0",
            "enum Foo { case myEnum }",
            "func isOperator(name: String) -> Bool",
            "func typeForKind(_ kind: SwiftDeclarationKind) -> String",
            "func == (lhs: SyntaxToken, rhs: SyntaxToken) -> Bool",
            "override func IsOperator(name: String) -> Bool"
        ]
    
        //会触发error
        static let triggeringExamples = [
            "↓let MyLet = 0",
            "↓let _myLet = 0",
            "private ↓let myLet_ = 0",
            "↓let myExtremelyVeryVeryVeryVeryVeryVeryLongLet = 0",
            "↓var myExtremelyVeryVeryVeryVeryVeryVeryLongVar = 0",
            "private ↓let _myExtremelyVeryVeryVeryVeryVeryVeryLongLet = 0",
            "↓let i = 0",
            "↓var id = 0",
            "private ↓let _i = 0",
            "↓func IsOperator(name: String) -> Bool",
            "enum Foo { case ↓MyEnum }"
        ]
    }
    

### 规则44: implicit\_getter

对于只有只读属性不建议重写get方法

识别码

默认是否启用

是否支持自动更正

类型

implicit\_getter

启用

no

style

代码示例:

    //不会触发error
    //重写get和set方法
    class Foo {
      var foo: Int {
        get {
          return 3
        }
        set {
          _abc = newValue 
        }
      }
    }
    //只读
    class Foo {
      var foo: Int {
         return 20 
      } 
    }
    
    class Foo {
      static var foo: Int {
         return 20 
      } 
    }
    
    
    //会触发error
    class Foo {
      var foo: Int {
        get {
          return 20 
        } 
      } 
    }
    
    class Foo {
      var foo: Int {
        get{
          return 20 
        } 
      } 
    }
    
    

### 规则45: implicit\_return

建议使用隐式返回闭包; 如: foo.map({ $0 + 1 })

识别码

默认是否启用

是否支持自动更正

类型

implicit\_return

未启用

no

style

代码示例:

    //推荐写法
    foo.map { $0 + 1 }
    foo.map({ $0 + 1 })
    foo.map { value in value + 1 }
    
    //不建议写法
    foo.map { value in
      return value + 1
    }
    foo.map {
      return $0 + 1
    }
    

### 规则46: implicitly\_unwrapped\_optional

尽量避免隐式解析可选类型的使用

识别码

默认是否启用

是否支持自动更正

类型

implicitly\_unwrapped\_optional

未启用

no

idiomatic

下面吗给出官方示例:

        public static let description = RuleDescription(
            identifier: "implicitly_unwrapped_optional",
            name: "Implicitly Unwrapped Optional",
            description: "Implicitly unwrapped optionals should be avoided when possible.",
            kind: .idiomatic,
            
            //不会触发warning
            nonTriggeringExamples: [
                "@IBOutlet private var label: UILabel!",
                "@IBOutlet var label: UILabel!",
                "@IBOutlet var label: [UILabel!]",
                "if !boolean {}",
                "let int: Int? = 42",
                "let int: Int? = nil"
            ],
            
            //会触发warning
            triggeringExamples: [
                "let label: UILabel!",
                "let IBOutlet: UILabel!",
                "let labels: [UILabel!]",
                "var ints: [Int!] = [42, nil, 42]",
                "let label: IBOutlet!",
                "let int: Int! = 42",
                "let int: Int! = nil",
                "var int: Int! = 42",
                "let int: ImplicitlyUnwrappedOptional<Int>",
                "let collection: AnyCollection<Int!>",
                "func foo(int: Int!) {}"
            ]
        )
    
    

### 规则47: is\_disjoint

初始化集合Set时,推荐使用Set.isDisjoint(), 不建议:Set.intersection

识别码

默认是否启用

是否支持自动更正

类型

is\_disjoint

启用

no

idiomatic

代码示例:

    //推荐写法
    _ = Set(syntaxKinds).isDisjoint(with: commentAndStringKindsSet)
    let isObjc = !objcAttributes.isDisjoint(with: dictionary.enclosedSwiftAttributes)
    

### 规则48: joined\_default\_parameter

joined方法使用默认分隔符时, 建议使用joined()方法, 而不是joined(separator: "")方法

识别码

默认是否启用

是否支持自动更正

类型

joined\_default\_parameter

未启用

yes

idiomatic

代码示例:

    //建议写法
    let foo = bar.joined()
    let foo = bar.joined(separator: ",")
    let foo = bar.joined(separator: toto)
    
    //不建议写法
    let foo = bar.joined(separator: "")
    let foo = bar.filter(toto).joined(separator: "")
    

### 规则49: large\_tuple

定义的元组成员个数,超过两个warning

识别码

默认是否启用

是否支持自动更正

类型

large\_tuple

启用

no

metrics

代码示例:

    //不会触发warning
    let foo: (Int, Int)
    let foo: (start: Int, end: Int)
    let foo: (Int, (Int, String))
    
    //会触发warning
    let foo: (Int, Int, Int)
    let foo: (start: Int, end: Int, value: String)
    let foo: (Int, (Int, Int, Int))
    

### 规则50: leading\_whitespace

文件开始不应该有空格或者换行, 否则就会触发warning

识别码

默认是否启用

是否支持自动更正

类型

leading\_whitespace

启用

yes

style

代码示例:

    /// 不会触发warning
    //
    //  ViewController.swift
    //  SwiftLint
    //
    //  Created by langke on 17/1/12.
    //  Copyright © 2017年 langke. All rights reserved.
    //
    
    /// 会触发warning
     //..................................这里有一个空格
    //  ViewController.swift
    //  SwiftLint
    //
    //  Created by langke on 17/1/12.
    //  Copyright © 2017年 langke. All rights reserved.
    //
    
    /// 会触发warning
    ......................................这里是一个空行
    //
    //  ViewController.swift
    //  SwiftLint
    //
    //  Created by langke on 17/1/12.
    //  Copyright © 2017年 langke. All rights reserved.
    //
    

> 参考文档  
> [SwiftLint规则官方文档](https://link.jianshu.com?t=https%3A%2F%2Fgithub.com%2Frealm%2FSwiftLint%2Fblob%2Fmaster%2FRules.md%23array-init)  
> [SwiftLint个规则详细介绍](https://link.jianshu.com?t=https%3A%2F%2Fgithub.com%2Frealm%2FSwiftLint%2Ftree%2Fmaster%2FSource%2FSwiftLintFramework%2FRules)

> 有些地方的解释和示例可能不是很完善, 希望各位大神多多指导,后续会持续更新中.......